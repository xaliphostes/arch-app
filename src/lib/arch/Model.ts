import { Material } from "./Material"
import { Remote } from "./Remote"
import { Mesh, Object3D } from 'three'
import { addSetupTo } from "./setupObject"

export enum ModelObjectType {
    FAULT = 'Fault',
    CAVITY = 'Cavity',
    GRID = 'Grid',
    WELL = 'Well'
}

export class Model {
    material = new Material()
    remote = new Remote()
    faults: Mesh[] = []
    cavities: Object3D[] = []
    grids: Object3D[] = []
    wells: Object3D[] = []
    halfSpace = false

    filename = ''
    size = 0
    lastModified = ''

    addFault(o: Mesh) {
        o.userData.modelType = ModelObjectType.FAULT
        this.faults.push(o)
        addSetupTo(o)
    }

    addCavity(o: Mesh) {
        o.userData.modelType = ModelObjectType.CAVITY
        this.cavities.push(o)
        addSetupTo(o, true)
    }

    addGrid(o: Mesh) {
        o.userData.modelType = ModelObjectType.GRID
        this.grids.push(o)
    }

    addWell(o: Mesh) {
        o.userData.modelType = ModelObjectType.WELL
        this.wells.push(o)
    }
}

// One model per cession
export const model = new Model()
