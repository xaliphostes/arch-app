import { Scene, Object3D, Vector3, Camera } from 'three'
import { Controls } from '../gl-helpers/utils'
import { fitScene } from './fitScene'

export function changeView(viewName: string,
    { scene, camera, controls, selection = undefined }:
    { scene: Scene, camera: Camera, controls: Controls, selection?: Object3D[] | Object3D })
{
    if (!controls) {
        throw 'Missing controls in args'
    }
    if (viewName) {
        const name = viewName.toLowerCase()
        const view = entries.get(name)

        if (view !== undefined) {
            controls.target.copy(view.target)            // target is Vector3
            controls.object.position.copy(view.position) // object is Object3D
            controls.object.up.copy(view.up)
            fitScene({ scene, camera, controls, selection })
            // camera.position.copy(controls.target).sub(direction)
        }
    }
}

// ---------------------------  private  ------------------------------------

const entries: Map<string, any> = new Map()
initViews()

function add(name: string, target: Vector3, position: Vector3, up: Vector3): void {
    const entry = {
        target: target.clone(),
        position: position.clone(),
        up: up.clone()
    }
    entries.set(name, entry)
}

function initViews() {
    if (entries.size !== 0) {
        return
    }
    add('up', new Vector3(0, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 1, 0))
    add('down', new Vector3(0, 0, 0), new Vector3(0, 0, -1), new Vector3(0, 1, 0))
    add('east', new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 0, 1))
    add('west', new Vector3(0, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 0, 1))
    add('north', new Vector3(0, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1))
    add('south', new Vector3(0, 0, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1))
}
