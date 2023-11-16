import { Camera, WebGLRenderer, Scene, Mesh } from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { TrackballControls } from '@youwol/three-extra'

export class Transformer {
    renderer: WebGLRenderer = undefined
    camera: Camera = undefined
    scene: Scene = undefined
    controls: TrackballControls = undefined
    renderFct: Function = undefined
    mode = 'translation'
    started = false

    constructor({ renderer, camera, controls, scene, renderFct, mode }) {
        this.renderer = renderer
        this.camera = camera
        this.controls = controls
        this.scene = scene
        this.renderFct = renderFct
        this.mode = mode
    }

    attach(mesh: Mesh) {
        if (mesh.userData.transform === undefined) {
            const transformControl = new TransformControls(this.camera, this.renderer.domElement)
            transformControl.mode = this.mode
            transformControl.addEventListener('change', this.renderFct)
            transformControl.addEventListener('dragging-changed', event => {
                this.controls.enabled = !event.value
            })
            transformControl.userData.isPickable = false
            transformControl.castShadow = true
            transformControl.receiveShadow = true
            transformControl.addEventListener('objectChange', () => {
                this.updateMeshGeometry()
            })

            mesh.userData.transform = transformControl
        }

        mesh.userData.transform.attach(mesh)
        this.scene.add(mesh.userData.transform)
        this.started = true
    }

    detach(mesh: Mesh) {
        if (this.started && mesh.userData.transform) {
            this.scene.remove(mesh.userData.transform)
            mesh.userData.transform.detach()
            mesh.userData.transform.dispose()
            mesh.userData.transform = undefined
            this.started = false
        }
    }

    updateMeshGeometry = () => {
        console.log('updating geom...')
    }
}