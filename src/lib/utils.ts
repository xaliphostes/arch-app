import {
    Mesh, Object3D, Color, PerspectiveCamera, Vector3, Camera,
    Box3
} from 'three'

export class ColorGUIHelper {
    object: any = undefined
    prop = ''
    constructor(object: any, prop: string) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`
    }
    set value(hexString) {
        this.object[this.prop].set(hexString)
        this.object.needsUpdate = true
    }
}

export function isPickable(o: Object3D): boolean {
    // return o.userData.hasOwnProperty('isPickable') && o.userData.isPickable === true
    if (o.userData.hasOwnProperty('isPickable')) {
        return o.userData.isPickable
    }
    return false
}

export const randColor = () => {
    const color = new Color(0xffffff)
    color.setHex(Math.random() * 0xffffff)
    return '#' + color.getHexString()
}

export interface Controls {
    target: Vector3
    object: Camera
    maxDistance: number
    update()
}

export function intersectedObject(intersects: Object3D[]) {
    let object: Object3D = undefined
    for (let i = 0; i < intersects.length; ++i) {
        if (isPickable(intersects[i].object)) {
            object = intersects[i].object
            break
        }
    }
    return object
}