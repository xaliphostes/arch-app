import { Raycaster, Vector2, Camera, Object3D } from "three"

/**
 * Try to pick an object
 * @category Commands
 */
export function pickObject(
    {event, scene, camera}:
    {event: MouseEvent, scene: Object3D, camera: Camera})
{
    const raycaster = new Raycaster()
    const mouse = new Vector2(
         (event.clientX/window.innerWidth )*2 - 1,
        -(event.clientY/window.innerHeight)*2 + 1
    )
    raycaster.setFromCamera(mouse, camera)
    let intersectedObjects = raycaster.intersectObjects(scene.children, true /* recursive */)
    intersectedObjects = intersectedObjects.filter( (value: any) => {
        if (value.object.pickable ===undefined) return true
        return value.object.pickable
    })

    if (intersectedObjects.length) {
        return intersectedObjects[0] // contains at least {object, point, distance}
    }
    return undefined
}
