import {
    Mesh, PerspectiveCamera, WebGLRenderer, Box3,
    Object3D, Vector3, DirectionalLightHelper,
    Group, Sphere, DirectionalLight, SphereGeometry,
    MeshBasicMaterial, HemisphereLight, PlaneGeometry,
    ShadowMaterial, GridHelper, Scene
} from 'three'

import { TrackballControls, zoomToIntersection } from '@youwol/three-extra'

import { Picker } from './Picker'
import { RenderFunctions } from './RenderFct'

import { OrientationGizmo } from './OrientationGizmo'
import { changeView } from './commands/changeView'
import { gradedBackground } from './Background'

export type GLParameters = {
    camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    controls: TrackballControls,
    renderFct: RenderFunctions,
    picker: Picker,
    group: Group,
    orientationGizmo: OrientationGizmo,
    baseGrid: Group,
    lights: Group
}

export let glParameters = {
    camera: undefined,
    scene: undefined,
    renderer: undefined,
    controls: undefined,
    renderFct: undefined,
    picker: undefined,
    group: undefined,
    orientationGizmo: undefined,
    baseGrid: undefined,
    lights: undefined
} as GLParameters

// export function addMesh(
//     { mesh, group, pickable = true }:
//     { mesh: Mesh, group: Group, pickable?: boolean })
// {
//     addSetupTo(mesh)
//     group.add(mesh)
//     mesh.userData.isPickable = pickable
//     mesh.castShadow = true
//     mesh.receiveShadow = true
// }

// ------------------------------------------------------

export function initGl(
    { div, backgroundColor = 0xa5a5a5 }:
        { div: string, backgroundColor?: number }) {

    Object3D.DEFAULT_UP.set(0, 0, 1) // !!!!!!!!!!! <================ !!!!!!!!!!!

    const canvas = document.getElementById(div)

    const renderer = new WebGLRenderer({
        canvas: canvas, antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.autoClear = false
    renderer.setClearColor(0x000000, 0.0)

    // Shift + dblclick => zoomToIntersection
    renderer.domElement.addEventListener('dblclick', (event: MouseEvent) => {
        if (event.shiftKey) {
            zoomToIntersection( {scene, event, camera, controls} )
            event.stopPropagation()
        }
    })

    glParameters.renderer = renderer

    const scene = new Scene()
    // scene.background = new Color(backgroundColor)
    scene.background = gradedBackground.generate()
    glParameters.scene = scene

    const group = new Group()
    group.name = 'MainGroup'
    group.userData.pickable = false
    glParameters.group = group
    scene.add(group)

    const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100000)
    camera.position.z = 3
    glParameters.camera = camera

    const controls = new TrackballControls(camera, renderer.domElement)
    glParameters.controls = controls

    createBasePlane(undefined)
    createDefaultLights2(undefined)

    {
        // scene.add(new AmbientLight(0xf0f0f0, 3))
        // const light = new SpotLight(0xffffff, 4.5)
        // light.position.set(0, 15, 2)
        // light.angle = Math.PI * 0.2
        // light.decay = 0
        // light.castShadow = true
        // light.shadow.camera.near = 1
        // light.shadow.camera.far = 20
        // light.shadow.bias = - 0.000222
        // light.shadow.mapSize.width = 1024
        // light.shadow.mapSize.height = 1024
        // scene.add(light)

        if (1) {
            /*
            const planeGeometry = new PlaneGeometry(10, 10);
            planeGeometry.rotateX(- Math.PI / 2);
            const planeMaterial = new ShadowMaterial({ color: 0x000000, opacity: 0.1 });

            const plane = new Mesh(planeGeometry, planeMaterial);
            plane.position.y = - 2
            plane.receiveShadow = true
            scene.add(plane)
            plane.userData.isPickable = false

            const helper = new GridHelper(10, 50)
            helper.position.y = - 1.99;
            helper.material.opacity = 0.2;
            helper.material.transparent = false
            scene.add(helper)
            helper.userData.isPickable = false
            */
        }
    }

    const renderFct = new RenderFunctions({ renderer, scene, camera })
    glParameters.renderFct = renderFct

    const picker = new Picker({
        renderer,
        camera,
        scene,
        controls,
        renderFct
    })
    glParameters.picker = picker

    const orientationGizmo = new OrientationGizmo(camera, { size: 90 })
    document.body.appendChild(orientationGizmo)
    orientationGizmo.onAxisSelected = function (axis) {
        // const distance = camera.position.distanceTo(controls.target)
        // camera.position.copy(axis.direction.multiplyScalar(distance).add(controls.target))
        // camera.lookAt(controls.target)
        switch (axis.axis) {
            case 'x': changeView('east', { scene, camera, controls }); break
            case '-x': changeView('west', { scene, camera, controls }); break
            case 'y': changeView('north', { scene, camera, controls }); break
            case '-y': changeView('south', { scene, camera, controls }); break
            case 'z': changeView('up', { scene, camera, controls }); break
            case '-z': changeView('down', { scene, camera, controls }); break
        }
    }
    glParameters.orientationGizmo = orientationGizmo

    window.addEventListener('resize', updateSize)
}

export function animate() {
    render()
    glParameters.orientationGizmo.update()
    requestAnimationFrame(animate)
}

function render() {
    glParameters.controls.update()
    // TWEEN.update()
    updateSize()
    glParameters.renderer.render(glParameters.scene, glParameters.camera)
}

function updateSize() {
    const width = window.innerWidth
    const height = window.innerHeight
    glParameters.camera.aspect = width / height
    glParameters.camera.updateProjectionMatrix()
    glParameters.renderer.setSize(width, height)
}

export function createDefaultLights2(object: Object3D): Group {
    let radius = 1
    let center = new Vector3(0, 0, 0)
    const g = new Group()

    if (object !== undefined) {
        const b = new Box3
        b.setFromObject(object)

        const sphere = new Sphere
        b.getBoundingSphere(sphere)

        radius = sphere.radius
        center = sphere.center
    }

    const dir = center.clone()
    dir.add(new Vector3(radius, radius, radius))


    let dirLight = new DirectionalLight(0xaaaaaa)
    dirLight.position.set(dir.x, dir.y, dir.z)
    dirLight.castShadow = false
    g.add(dirLight)

    dirLight = new DirectionalLight(0xaaaaaa)
    dirLight.position.set(dir.x, dir.y, -dir.z)
    dirLight.castShadow = false
    g.add(dirLight)

    // ---------------------------------------------

    const intensitySky = 0.4 // param for flux
    const intensityground = 0.4 // param for flux
    const sky = 0xffffff

    const ground = createGrayColor(intensityground)

    const h1 = new HemisphereLight(sky, ground, intensitySky)
    h1.position.set(0, 10, 10)
    g.add(h1)

    const h2 = new HemisphereLight(sky, ground, intensitySky)
    h2.position.set(0, -10, -10)
    g.add(h2)

    return g
}

export function createDefaultLights(object: Object3D): Group {
    let radius = 1
    let center = new Vector3(0, 0, 0)

    const g = new Group()
    g.userData.pickable = false
    g.name = 'lights'

    if (object !== undefined) {
        const b = new Box3
        b.setFromObject(object)

        const sphere = new Sphere
        b.getBoundingSphere(sphere)

        radius = sphere.radius
        center = sphere.center
    }

    // let dir = new Vector3(radius,4*radius,3*radius)
    // //let dir = new Vector3(5,20,12)
    const dir = center.clone()
    dir.add(new Vector3(radius, radius, radius * 2))

    const dirLight = new DirectionalLight(0xaaaaaa)
    // dirLight = new SpotLight(0xaaaaaa)

    if (object) {
        dirLight.target = object
    }
    dirLight.position.set(dir.x, dir.y, dir.z)
    dirLight.castShadow = true
    g.add(dirLight)

    // dirLight.shadow.camera.near = 0.01
    // dirLight.shadow.camera.far = 100000
    // dirLight.shadow.mapSize.x = 512
    // dirLight.shadow.mapSize.y = 512
    // const size = 100
    // dirLight.shadow.camera.left = -size;
    // dirLight.shadow.camera.bottom = -size;
    // dirLight.shadow.camera.right = size;
    // dirLight.shadow.camera.top = size;

    // DEBUG
    if (0) {
        let size = radius / 10;
        const sphere = new Mesh(new SphereGeometry(size, 32, 32), new MeshBasicMaterial({ color: 0xff0000 }));
        sphere.position.set(dir.x, dir.y, dir.z)
        g.add(sphere)
        const helper = new DirectionalLightHelper(dirLight, 5);
        // glParameters.scene.add( helper );
    }
    //


    // ---------------------------------------------

    const intensitySky = 0.4 // param for flux
    const intensityground = 0.4 // param for flux
    const sky = 0xffffff

    const ground = createGrayColor(intensityground)

    const h1 = new HemisphereLight(sky, ground, intensitySky)
    h1.position.set(0, 10, 10)
    g.add(h1)

    const h2 = new HemisphereLight(sky, ground, intensitySky)
    h2.position.set(0, -10, -10)
    g.add(h2)

    // ----------------------------------

    if (glParameters.lights !== undefined) {
        glParameters.scene.remove(glParameters.lights)
    }

    glParameters.lights = g
    glParameters.scene.add(glParameters.lights)
}

export function createBasePlane(object: Object3D) {
    let radius = 1
    let center = new Vector3(0, 0, 0)

    if (object !== undefined) {
        const b = new Box3
        b.setFromObject(object)

        const sphere = new Sphere
        b.getBoundingSphere(sphere)

        radius = sphere.radius
        center = sphere.center
    }

    const R = radius * 5
    const scaling = 0.6

    // ------------------------------------------------

    const planeGeometry = new PlaneGeometry(R, R)
    const planeMaterial = new ShadowMaterial({ color: 0x000000, opacity: 0.1 })

    const plane = new Mesh(planeGeometry, planeMaterial)
    plane.rotation.set(Math.PI / 2, Math.PI / 2, 0)
    plane.position.x = center.x
    plane.position.y = center.y
    plane.position.z = center.z - radius * scaling
    plane.receiveShadow = true
    plane.userData.isPickable = false
    plane.name = 'grid-plane'

    const helper = new GridHelper(R, 50)
    helper.rotation.set(Math.PI / 2, Math.PI / 2, 0)
    helper.position.x = center.x
    helper.position.y = center.y
    helper.position.z = center.z - radius * scaling * 0.99
    helper.material.opacity = 0.2
    helper.material.transparent = false
    helper.userData.isPickable = false
    plane.name = 'grid-helper'

    const group = new Group()
    group.add(plane)
    group.add(helper)
    group.userData.isPickable = false
    group.name = 'grid'

    if (glParameters.baseGrid !== undefined) {
        glParameters.scene.remove(glParameters.baseGrid)
    }

    glParameters.baseGrid = group
    glParameters.scene.add(glParameters.baseGrid)
}

// ------------------- private --------------------------------------------

function createGrayColor(intensity) {
    if (intensity === 0) {
        return '#000000'
    }
    const value = intensity * 0xFF | 0
    const grayscale = (value << 16) | (value << 8) | value
    const gray = grayscale.toString(16)
    return gray.length === 5 ? '#0' + gray : '#' + gray
}
