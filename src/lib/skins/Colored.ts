import { Skin } from './Skin'
import { Object3D } from 'three'
import * as kepler from "@youwol/kepler"
import { Surface } from '../loaders'
import { FolderApi, Pane } from 'tweakpane'
import { ColorGUIHelper } from '../utils'

export const Colored = {

    createObject: (parent: Surface): Object3D => {
        // const attr = parent.manager.serie(1, attribute)
        // if (attr === undefined) {
        //     throw `Attribute named ${attribute} does not exist`
        // }

        // const mM = minMaxArray(attr.array)
        // console.log('attr :', attribute)
        // console.log('min  :', mM[0].toFixed(3))
        // console.log('max  :', mM[1].toFixed(3))

        // const skin = kepler.paintAttribute(parent.surface, attr, new kepler.PaintParameters({
        //     atVertex: true,
        //     lut: 'Igeoss',
        //     duplicateLut: false
        // }))

        // skin.visible = false
        // skin.userData.pickable = false
        // parent.surface.add(skin)

        // return skin
    },

    createPanel: (object: Object3D, parent: Pane): FolderApi => {
        const folder = parent.addFolder({
            title: 'Points'
        })

        folder.addBinding(object, 'visible', { label: 'Show' }).on( 'change', () => {

        })

        folder.addBinding(new ColorGUIHelper(object.material, 'color'), 'value', { label: 'Color' })
        folder.addBinding(object.material, 'size', { label: 'Size' })
        folder.addBinding(object.material, 'sizeAttenuation', { label: 'Attenuation' })

        folder.expanded = false
        return folder
    }

} as Skin
