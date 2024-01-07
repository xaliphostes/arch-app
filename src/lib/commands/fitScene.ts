import { Controls, isPickable } from '../gl-helpers/utils'
import { Object3D, PerspectiveCamera, Vector3, Camera, Box3 } from 'three'

export function fitScene(
    { scene, camera, controls, selection, fitRatio }:
        {
            scene?: any,
            camera: Camera,
            controls: Controls,
            selection?: Object3D[] | Object3D,
            fitRatio?: number
        }) {
    if (!camera) {
        throw new Error('Missing camera')
    }
    if (!controls) {
        throw new Error('Missing control')
    }
    if (!(camera instanceof PerspectiveCamera)) {
        throw new Error('Ortho camera not suppported yet')
    }

    if (selection === undefined && !scene) {
        throw new Error('Missing scene or selection array')
    }

    selection = selection !== undefined ? selection : scene.children
    fitRatio = fitRatio !== undefined ? fitRatio : 1.2

    const box = new Box3()

    if (!Array.isArray(selection)) {
        selection.traverse(element => {
            if (isPickable(element)) {
                box.expandByObject(element)
            }
        })
    }
    else {
        selection.forEach((object: Object3D) => {
            object.traverse(o => {
                if (isPickable(o)) {
                    box.expandByObject(o)
                }
            })
        })
    }

    if (box.isEmpty() === false) {
        const size = box.getSize(new Vector3())
        const center = box.getCenter(new Vector3())

        const maxSize = Math.max(size.x, size.y, size.z)
        const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
        const fitWidthDistance = fitHeightDistance / camera.aspect
        const distance = fitRatio * Math.max(fitHeightDistance, fitWidthDistance)

        const direction = controls.target
            .clone()
            .sub(camera.position)
            .normalize()
            .multiplyScalar(distance)

        controls.maxDistance = distance * 10
        controls.target.copy(center)
        camera.near = distance / 100
        camera.far = distance * 100
        camera.updateProjectionMatrix()
        camera.position.copy(controls.target).sub(direction)
    }
}
