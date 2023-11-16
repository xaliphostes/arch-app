import { Skin } from './Skin'
import { Object3D } from 'three'
import * as kepler from "@youwol/kepler"
import { Surface } from '../loaders'
import { FolderApi, Pane } from 'tweakpane'
import { ColorGUIHelper } from '../utils'

export const Points = {

    createObject: (parent: Surface): Object3D => {
        const skin = kepler.createPointset({
            position: parent.positions,
            parameters: new kepler.PointsetParameters({
                size: 5,
                color: "#ff0000",
                sizeAttenuation: true
            })
        })

        skin.visible = false
        skin.userData.pickable = false
        parent.surface.add(skin)

        return skin
    },

    createPanel: (object: Object3D, parent: Pane): FolderApi => {
        const folder = parent.addFolder({
            title: 'Points'
        })

        folder.addBinding(object, 'visible', { label: 'Show' })
        folder.addBinding(new ColorGUIHelper(object.material, 'color'), 'value', { label: 'Color' })
        folder.addBinding(object.material, 'size', { label: 'Size' })
        folder.addBinding(object.material, 'sizeAttenuation', { label: 'Attenuation' })

        folder.expanded = false
        return folder
    }

} as Skin
