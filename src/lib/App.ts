import { PanelsContainer } from "./PanelsContainer"
import { animate, glParameters, initGl } from "./gl"
import { displayPanel } from "./panels/display"
import { editPanel } from "./panels/edit"
import { generalPanel } from "./panels/general"
import { isoContoursPanel } from "./panels/isoContours"
import { materialPanel } from "./panels/material"
import { remotePanel } from "./panels/remote"
import { bcPanel } from "./panels/bc"
import { modelParamsPanel } from "./panels/modelParams"
import { createMenuFile } from "./panels/menuFile"
import { simulationPanel } from "./panels/simulation"

export let objectPanelsContainer: PanelsContainer = undefined
export let modelPanelsContainer: PanelsContainer = undefined
export let generalPanelsContainer: PanelsContainer = undefined

export class App {

    static objectPanel(): PanelsContainer {
        return objectPanelsContainer
    }

    static modelPanel(): PanelsContainer {
        return modelPanelsContainer
    }

    static generalPanel(): PanelsContainer {
        return generalPanelsContainer
    }

    static initialize() {
        initGl({ div: 'c', backgroundColor: 0xa5a5a5 })

        createMenuFile()

        modelPanelsContainer = new PanelsContainer({name: 'Model', div: 'model-display', showObject: false})
        objectPanelsContainer = new PanelsContainer({name: 'Object', div: 'object-display'})
        generalPanelsContainer = new PanelsContainer({name: 'General', div: 'general-display', showObject: false})

        modelPanelsContainer.registerPanels([
            {name: 'Materiel', create: materialPanel, isStatic: true},
            {name: 'Remote', create: remotePanel, isStatic: true},
            {name: 'Others', create: modelParamsPanel, isStatic: true},
            {name: 'simulation', create: simulationPanel, isStatic: true},
        ])

        objectPanelsContainer.registerPanels([
            {name: 'Main display', create: displayPanel, isStatic: false},
            {name: 'IsoContours', create: isoContoursPanel, isStatic: false},
            {name: 'Edit', create: editPanel, isStatic: false},
            {name: 'Boundary conditions', create: bcPanel, isStatic: false}
        ])

        generalPanelsContainer.registerPanels([
            {name: 'General', create: generalPanel, isStatic: true}
        ])

        glParameters.picker.setPanels(objectPanelsContainer)
        animate()

        // Add two 3D objects in the scene for debug purpose
        //
        // populateGlDebug()
        // fitScene({
        //     scene: glParameters.scene,
        //     camera: glParameters.camera,
        //     controls: glParameters.controls
        // })
    }

}
