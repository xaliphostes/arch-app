import { Mesh } from 'three'
import { GLParameters } from "../gl-helpers/gl"
import { bcPanel } from "./bc"
import { Pane } from 'tweakpane'
import { remotePanel } from './remote'
import { generalPanel } from './general'
import { modelOtherPanel } from './modelOther'
import { materialPanel } from './material'
import { simulationPanel } from './simulation'
import { surfaceDisplay } from './surfaceDisplay'

type PanelParameters = {
    mesh: Mesh,
    params: GLParameters,
    parent: Pane
}

export namespace PanelFactory {

    const map_: Map<string, any> = new Map()

    export const bind = (obj: any, name: string = '') => {
        name.length === 0 ? map_.set(obj.name, obj) : map_.set(name, obj)
    }

    export const generate = (name: string, params: PanelParameters): boolean => {
        const M = map_.get(name)
        if (M) {
            M(params)
            return true
        }
        return false
    }

    export const exists = (name: string): boolean => {
        return map_.get(name) !== undefined
    }

    export const names = (): string[] => {
        return Array.from(map_.keys())
    }
}

// ------------------------------------------------------

PanelFactory.bind(bcPanel, 'boundary-conditions')
PanelFactory.bind(surfaceDisplay, 'surface-display')

PanelFactory.bind(materialPanel, 'material')
PanelFactory.bind(remotePanel, 'remote')
PanelFactory.bind(modelOtherPanel, 'model-parameters')
PanelFactory.bind(simulationPanel, 'simulation')

PanelFactory.bind(generalPanel, 'general')
