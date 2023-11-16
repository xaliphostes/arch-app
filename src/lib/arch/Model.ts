import { Material } from "./Material"
import { Remote } from "./Remote"
import { Mesh } from 'three'
import { addSetupTo } from "./setupObject"

export class Model {
    material = new Material()
    remote = new Remote()
    objects: Mesh[] = []
    halfSpace = false

    addObject(o: Mesh) {
        this.objects.push(o)
        addSetupTo(o)
    }
}

export const model = new Model()
