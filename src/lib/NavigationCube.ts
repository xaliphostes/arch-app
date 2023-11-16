import {
    BoxGeometry, Camera, DoubleSide, Mesh, MeshBasicMaterial, 
    Object3D, 
    OrthographicCamera, 
    PerspectiveCamera, PlaneGeometry, Raycaster, Scene, TextureLoader, 
    Vector2, Vector3, WebGLRenderer
} from "three"

import { Controls, changeView } from '@youwol/three-extra'
import { RenderFunctions } from "./RenderFct"

export class NavigationCubeParameters {
	scene     : Scene
    camera    : Camera
	renderer  : WebGLRenderer
    controls  : Controls
	renderFunctions: RenderFunctions
	domElement: HTMLElement
    labels    : string[]
    domHome   : HTMLElement
    domSaveHome: HTMLElement

    constructor(
		{
			scene, 
            camera, 
            renderer, 
            controls,
			renderFunctions,
            labels = ['RIGHT', 'LEFT', 'TOP', 'BOTTOM', 'FRONT', 'BACK'],
            domElement,
			domHome     = undefined,
			domSaveHome = undefined
		}:{
			scene: Scene, 
            camera: Camera, 
            renderer: WebGLRenderer, 
            controls: Controls,
			renderFunctions: RenderFunctions,
            domElement: HTMLElement
            labels?: string[],
			domHome?: HTMLElement,
			domSaveHome?: HTMLElement
		})
	{
        this.domHome     = domHome
        this.domSaveHome = domSaveHome
		this.scene 		 = scene
		this.camera 	 = camera
		this.renderer 	 = renderer
		this.controls 	 = controls
		this.domElement  = domElement
		this.renderFunctions = renderFunctions
        this.labels = labels
    }
}

export function installNavigationCube(params: NavigationCubeParameters) {
    return new NavigationCube(params)
}

export class NavigationCube {
    camera  :           Camera = undefined
    renderer:           WebGLRenderer = undefined
    cameraDistance:     number = 1.75
    hasMoved:           boolean  = false
    //cubeController:     Controls = undefined
    scene:              Scene = new Scene
    planes:             Array<Mesh> = []
    cube:               Mesh = undefined
    parentScene:        Scene
    parentCamera:       Camera
    parentRenderer:     WebGLRenderer
    renderFunctions:    RenderFunctions
    domElement:         HTMLElement
    activePlane:        Object3D = undefined
    oldPosition:        Vector3 = new Vector3()
    newPosition:        Vector3 = new Vector3()
    uuidFct:            string = undefined

    controls:           Controls
    serializer:         TrackballSerializer = undefined

	constructor(params: NavigationCubeParameters) {
        this.parentScene    = params.scene
        this.parentRenderer = params.renderer
        this.parentCamera   = params.camera
        this.domElement     = params.domElement
        
        this.renderFunctions = params.renderFunctions
        this.controls = params.controls

        this.camera = new PerspectiveCamera(70, this.domElement.offsetWidth / this.domElement.offsetHeight, 0.1, 100)
        this.renderer = new WebGLRenderer({
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true
        })
        this.renderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.domElement.appendChild(this.renderer.domElement)

        /*
        this.cubeController = new TrackballControls(this.parentCamera, this.renderer.domElement)
        //this.cubeController.enablePan = false;
        //this.cubeController.enableZoom = false;
        this.cubeController.noPan = true
        this.cubeController.noZoom = true
        this.cubeController.rotateSpeed = 0.125
        */

        // let cubeController = new TrackballControls(this.camera, this.renderer.domElement);
	    // // cubeController.enablePan = false;
	    // // cubeController.enableZoom = false;
        // cubeController.noPan = true
	    // cubeController.noZoom = true
        // cubeController.rotateSpeed = 0.125;
        // //cubeController.addEventListener('change', () => this.renderFunctions.render())

        this.uuidFct = this.renderFunctions.add(() => {
            this.updateCubeCamera()
            this.renderer.render(this.scene, this.camera)
        })

        this.generateCube(params)

        this.renderer.domElement.onmousemove = this.onMouseMove
        this.renderer.domElement.onclick = this.onClick
        this.renderer.domElement.onmouseleave = this.onMouseLeave

        this.serializer     = new TrackballSerializer(this.controls)
    }

    dispose() {
        this.renderFunctions.remove(this.uuidFct)
    }

    saveView() {
        this.serializer.serialize()
    }

    restoreView() {
        this.serializer.deserialize()
    }

    private onClick = (e: MouseEvent) => {
        this.renderer.domElement.onmousemove(e)
        if (!this.activePlane || this.hasMoved) {
            return false
        }

        changeView(this.activePlane.name, {
            scene: this.parentScene,
            camera: this.parentCamera,
            controls: this.controls
        })

        this.deactivate()
    }

    private deactivate = () => {
        if (this.activePlane !== undefined) {
            const mesh = this.activePlane as Mesh
            const material = mesh.material as MeshBasicMaterial
            material.opacity = 0;
            material.needsUpdate = true
            this.activePlane = undefined
        }
    } 

    private onMouseMove = (e: MouseEvent) => {
        this.deactivate()

        let x = e.offsetX
        let y = e.offsetY
        let size = this.renderer.getSize(new Vector2())
        let mouse = new Vector2(x / size.width * 2 - 1, -y / size.height * 2 + 1)
        
        let raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        let intersects = raycaster.intersectObjects(this.planes.concat(this.cube))

        if (intersects.length > 0 && intersects[0].object != this.cube) {
            const mesh = intersects[0].object as Mesh
            const material = mesh.material as MeshBasicMaterial
            this.activePlane = mesh
            material.opacity = 0.2;
            material.needsUpdate = true
            this.renderFunctions.render()
        }
        else {
            this.deactivate()
        }
    }

    private onMouseLeave = (e: MouseEvent) => {
        this.renderFunctions.render()
    }

    private updateCubeCamera = () => {
        this.camera.rotation.copy(this.parentCamera.rotation);
        let dir = this.parentCamera.position.clone().sub(this.controls.target).normalize();
        this.camera.position.copy(dir.multiplyScalar(this.cameraDistance))
    }

    private generateCube(option?: NavigationCubeParameters) {
        // Save current view
        let elt: HTMLElement = option ? option.domSaveHome : undefined
        if (elt) elt.addEventListener('click', () => this.serializer.serialize())

        // Restore view
        elt = option ? option.domHome : undefined
        if (elt) elt.addEventListener('click', () => this.serializer.deserialize())

        let materials = [];
        let texts = option.labels

        let textureLoader = new TextureLoader();
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        
        let size = 64;
        canvas.width = size;
        canvas.height = size;

        // Faces
        ctx.font = 'bolder 12px "Open sans", Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        // Faces colors (grad or not)
        let mainColor = '#333';
        let otherColor = '#333';

        let bg = ctx.createLinearGradient(0, 0, 0, size);
        bg.addColorStop(0, mainColor);
        bg.addColorStop(1,  otherColor);

        // Border lines
        for (let i = 0; i < 6; i++) {
            if (texts[i] == texts[2]) {
                ctx.fillStyle = mainColor;
            } else if (texts[i] == texts[3]) {
                ctx.fillStyle = otherColor;
            } else {
                ctx.fillStyle = bg;
            }
            ctx.fillRect(0, 0, size, size);
            ctx.strokeStyle = '#fff';
            ctx.fillStyle = '#fff';
            //ctx.setLineDash([8, 8]);
            ctx.lineWidth = 4;
            ctx.strokeRect(0, 0, size, size);
            ctx.fillStyle = '#FFF';
            ctx.fillText(texts[i], size / 2, size / 2);
            materials[i] = new MeshBasicMaterial({
                map: textureLoader.load(canvas.toDataURL())
            });
        }

        let planeMaterial = new MeshBasicMaterial({
            side: DoubleSide,
            color: 0xffc000,
            transparent: true,
            opacity: 0,
            depthTest: false
        });
        let planeSize = 0.7;
        let planeGeometry = new PlaneGeometry(planeSize, planeSize);

        let a = 0.51;

        let plane1 = new Mesh(planeGeometry, planeMaterial.clone());
        plane1.position.z = a;
        plane1.name = 'up'
        this.scene.add(plane1);
        this.planes.push(plane1);

        let plane2 = new Mesh(planeGeometry, planeMaterial.clone());
        //plane2.rotation.y = Math.PI
        //plane2.position.z = -a;
        plane2.name = 'down'
        this.scene.add(plane2);
        this.planes.push(plane2);

        let plane3 = new Mesh(planeGeometry, planeMaterial.clone());
        plane3.rotation.y = Math.PI / 2;
        plane3.position.x = a;
        plane3.name = 'east'
        this.scene.add(plane3);
        this.planes.push(plane3);

        let plane4 = new Mesh(planeGeometry, planeMaterial.clone());
        plane4.rotation.y = Math.PI / 2;
        plane4.position.x = -a;
        plane4.name = 'west'
        this.scene.add(plane4);
        this.planes.push(plane4);

        let plane5 = new Mesh(planeGeometry, planeMaterial.clone());
        plane5.rotation.x = Math.PI / 2;
        plane5.position.y = a;
        plane5.name = 'north'
        this.scene.add(plane5);
        this.planes.push(plane5);

        let plane6 = new Mesh(planeGeometry, planeMaterial.clone())
        plane6.rotation.x = Math.PI / 2
        plane6.position.y = -a
        plane6.name = 'south'
        this.scene.add(plane6)
        this.planes.push(plane6)

        this.cube = new Mesh(new BoxGeometry(1, 1, 1), materials)
        this.cube.rotation.x = Math.PI / 2
        this.scene.add(this.cube)

        if (0) {
            let groundMaterial = new MeshBasicMaterial({color: 0xffffff})
            let groundGeometry = new PlaneGeometry(1, 1)
            let groundPlane = new Mesh(groundGeometry, groundMaterial)
            groundPlane.rotation.x = -Math.PI / 2
            groundPlane.position.y = -0.6
            this.cube.add(groundPlane)
        }
    }
}

class TrackballSerializer {
    constructor(private readonly controls: Controls) {
    }

    serialize() {
        localStorage.setItem("controls.target.x", this.controls.target.x.toString() )
        localStorage.setItem("controls.target.y", this.controls.target.y.toString() )
        localStorage.setItem("controls.target.z", this.controls.target.z.toString() )

        localStorage.setItem("controls.object.position.x", this.controls.object.position.x.toString() )
        localStorage.setItem("controls.object.position.y", this.controls.object.position.y.toString() )
        localStorage.setItem("controls.object.position.z", this.controls.object.position.z.toString() )

        localStorage.setItem("controls.object.up.x", this.controls.object.up.x.toString() )
        localStorage.setItem("controls.object.up.y", this.controls.object.up.y.toString() )
        localStorage.setItem("controls.object.up.z", this.controls.object.up.z.toString() )

        const camera = this.controls.object as PerspectiveCamera | OrthographicCamera
        localStorage.setItem("controls.object.zoom", camera.zoom.toString() )
    }

    deserialize() {
        if (! localStorage.getItem("controls.target.x")) return

        this.controls.target.x = parseFloat(localStorage.getItem("controls.target.x"))
        this.controls.target.y = parseFloat(localStorage.getItem("controls.target.y"))
        this.controls.target.z = parseFloat(localStorage.getItem("controls.target.z"))

        this.controls.object.position.x = parseFloat(localStorage.getItem("controls.object.position.x"))
        this.controls.object.position.y = parseFloat(localStorage.getItem("controls.object.position.y"))
        this.controls.object.position.z = parseFloat(localStorage.getItem("controls.object.position.z"))

        this.controls.object.up.x = parseFloat(localStorage.getItem("controls.object.up.x"))
        this.controls.object.up.y = parseFloat(localStorage.getItem("controls.object.up.y"))
        this.controls.object.up.z = parseFloat(localStorage.getItem("controls.object.up.z"))

        const camera = this.controls.object as PerspectiveCamera | OrthographicCamera
        camera.zoom = parseFloat(localStorage.getItem("controls.object.zoom"))

        this.controls.update()
    }
}
