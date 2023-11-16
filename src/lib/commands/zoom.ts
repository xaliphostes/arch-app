import { Vector3, Camera, Box3, Object3D } from "three"
import { animate } from './animationLoop'
import { pickObject } from './pick'

/**
 * Center and fit the scene using animation
 */
export function zoomToModel(
    {scene, camera, controls, duration=300}:
    {scene: Object3D, camera: Camera, controls: any, duration?: number})
{
    const box = new Box3().setFromObject(scene)
    const center = box.getCenter(new Vector3())
    const size   = box.getSize(new Vector3())
    const maxSize = Math.max(size.x, size.y, size.z)
    const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera["fov"]) / 360))
    const fitWidthDistance = fitHeightDistance / camera["aspect"]
    const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance)
    const direction = controls.target
        .clone()
        .sub(camera.position)
        .normalize()
        .multiplyScalar(distance)
    
    const beginTarget = controls.target.clone()
    const endTarget   = center
    const beginCamera = controls.object.position.clone()
    const endCamera   = controls.target.clone().sub(direction)

    animate({
        cb: (t:number) => {
            controls.object.position.copy( (new Vector3()).lerpVectors(beginCamera, endCamera, t) )
            controls.target.copy( (new Vector3()).lerpVectors(beginTarget, endTarget, t) )
        }, 
        nb:20, 
        time: duration
    })
}

/**
 * Zoom to the intersected point with animation (duration).
 * If nothing is picked, the model is centered and unzoom until fitting
 * the whole scene
 */
export function zoomToIntersection(
    {event, scene, camera, controls, zoomFactor=0.5, duration=300}:
    {event: MouseEvent, scene: Object3D, camera: Camera, controls: any, zoomFactor?: number, duration?: number})
{
    const I = pickObject({event, scene, camera})
    if (I === undefined) {
        zoomToModel({scene, camera, controls})
        return
    }

    const beginCamera = controls.object.position.clone()
    const endCamera   = I.point.clone().add(beginCamera).multiplyScalar(zoomFactor)
    const beginTarget = controls.target.clone()
    const endTarget   = I.point.clone()

    animate({
        cb: (t:number) => {
            controls.object.position.copy( (new Vector3()).lerpVectors(beginCamera, endCamera, t) )
            controls.target.         copy( (new Vector3()).lerpVectors(beginTarget, endTarget, t) )
        }, 
        nb:20, 
        time: duration
    })
}
