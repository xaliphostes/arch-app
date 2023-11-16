import { Object3D } from 'three'
import { FolderApi } from 'tweakpane'
import { ColorGUIHelper } from '../utils'
import { GLParameters, glParameters } from '../gl'
import { gradedBackground } from '../Background'

export function generalPanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    parent.addBinding(gradedBackground.start, 'color', { label: 'Color' }).on( 'change', e => {
        glParameters.scene.background = gradedBackground.generate()
    })

    parent.addBinding(gradedBackground.stop, 'color', { label: 'Color' }).on( 'change', e => {
        glParameters.scene.background = gradedBackground.generate()
    })

    // parent.addBinding(new ColorGUIHelper(gradedBackground.stop, 'color'), 'value', { label: 'Color' })
}
