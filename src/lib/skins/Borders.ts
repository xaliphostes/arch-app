import { Skin } from './Skin'
import { Object3D } from 'three'
import * as kepler from "@youwol/kepler"
import { Surface } from '../loaders'
import { FolderApi, Pane } from 'tweakpane'
import { ColorGUIHelper } from '../utils'

export const Borders = {

    createObject: (parent: Surface): Object3D => {
        const skin = kepler.createSurfaceBorders({
            mesh: parent.surface,
            parameters: new kepler.LinesetParameters({
                color: '#000000',
                useTube: false,
                tubeRadius: 1
            })
        })

        skin.visible = false
        skin.userData.pickable = false
        parent.surface.add(skin)

        return skin
    },

    createPanel: (object: Object3D, parent: Pane): FolderApi => {
        const folder = parent.addFolder({
            title: 'Borders'
        })

        folder.addBinding(object, 'visible', { label: 'Show' })
        folder.addBinding(new ColorGUIHelper(object.material, 'color'), 'value', { label: 'Color' })

        folder.expanded = false
        return folder
    }

} as Skin
