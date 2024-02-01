import { model } from "../arch/Model"
import { glParameters } from "../gl-helpers/gl"

export function clearModel() {
    // Clear the GL model
    glParameters.faults.clear()
    glParameters.grids.clear()
    glParameters.cavities.clear()

    // Clear teh ARCH model
    model.faults = []
    model.cavities = []
    model.wells = []
    model.grids = []
    model.filename = ''
    model.lastModified = ''
    model.size = 0
}