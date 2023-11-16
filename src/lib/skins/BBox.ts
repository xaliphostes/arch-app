import { Skin } from './Skin'
import { Object3D } from 'three'
import * as kepler from "@youwol/kepler"
import { Surface } from '../loaders'
import { FolderApi, Pane } from 'tweakpane'
import { ColorGUIHelper } from '../utils'

export const BBox = {

    createObject: (parent: Surface): Object3D => {
        const skin = kepler.createBBox(parent.surface, new kepler.BBoxParameters({ color: '#000000' }))

        skin.visible = false
        skin.userData.pickable = false
        parent.surface.add(skin)

        return skin
    },

    createPanel: (object: Object3D, parent: Pane): FolderApi => {
        const folder = parent.addFolder({
            title: 'Bounding box'
        })

        folder.addBinding(object, 'visible', { label: 'Show' })
        folder.addBinding(new ColorGUIHelper(object.material, 'color'), 'value', { label: 'Color' })

        folder.expanded = false
        return folder
    }

} as Skin
