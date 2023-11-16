import { Camera, WebGLRenderer, Scene, Raycaster, Vector2, Object3D, ArrowHelper } from 'three'
import { TrackballControls } from '@youwol/three-extra'
import { PanelsContainer } from './PanelsContainer'
import { intersectedObject, isPickable } from './utils'

export class Picker {
    renderer: WebGLRenderer = undefined
    camera: Camera = undefined
    scene: Scene = undefined
    controls: TrackballControls = undefined
    canvas: HTMLElement = undefined
    renderFct: Function = undefined
    raycaster = new Raycaster()
    pointer = new Vector2()
    isActivated = false
    container: PanelsContainer = undefined
    curSelection: Object3D = undefined

    // mdown = false
    // arrow: Object3D = undefined

    constructor({ renderer, camera, scene, controls, renderFct, canvas = 'c' }) {
        this.renderer = renderer
        this.camera = camera
        this.scene = scene
        this.controls = controls
        this.renderFct = renderFct
        this.isActivated = false

        this.canvas = document.getElementById(canvas)
        // this.canvas.onmousedown = this.onMouseDown
        // this.canvas.onmousemove = this.onMouseMove
        // this.canvas.onmouseup = this.onMouseUp

        this.activate(true)
    }

    setPanels(panels: PanelsContainer) {
        this.container = panels
    }

    activate(b: boolean) {
        if (b === true && this.isActivated === false) {
            this.canvas.addEventListener('dblclick', this.onDblClick)
            this.isActivated = true
        }
        else if (b === false && this.isActivated === true) {
            this.canvas.removeEventListener('dblclick', this.onDblClick)
            this.isActivated = false
        }
    }

    onDblClick = (event: MouseEvent) => {
        const rect = this.renderer.domElement.getBoundingClientRect()
        this.pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1
        this.pointer.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1

        this.raycaster.setFromCamera(this.pointer, this.camera)
        const intersects = this.raycaster.intersectObjects(this.scene.children)

        // console.log(intersects)
        
        if (intersects.length === 0) {
            this.container.hide()
            this.curSelection = undefined
        }
        else {
            // The closest pickable object...
            const object = intersectedObject(intersects)
            if (object !== undefined) {
                if (object !== this.curSelection) {
                    this.container.displayPanel(object)
                    this.curSelection = object
                }
                else {
                    // Do nothing as the panel is already here
                }
            }
            else {
                this.container.hide()
                this.curSelection = undefined
            }
        }
    }

    /*
    onMouseDown = (event: MouseEvent) => {
        const rect = this.renderer.domElement.getBoundingClientRect()
        this.pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
        this.pointer.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera)

        this.mdown = true
        this.arrow = new ArrowHelper(this.raycaster.ray.direction, this.raycaster.ray.origin, 300, 0xff0000)
        this.scene.add( this.arrow )
    }

    onMouseMove = (event: MouseEvent) => {
        if (this.mdown) {
            const rect = this.renderer.domElement.getBoundingClientRect()
            this.pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
            this.pointer.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
            this.raycaster.setFromCamera(this.pointer, this.camera)

            // this.arrow.setDirection(this.raycaster.ray.direction)
            // this.arrow.position.set(this.raycaster.ray.origin)
        }
    }

    onMouseUp = (event: MouseEvent) => {
        if (this.mdown) {
            this.mdown = false
            this.scene.remove( this.arrow )
            this.arrow = undefined
        }
    }
    */

    draw() {
    }

}
