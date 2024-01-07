import { Object3D } from 'three'
import { FolderApi } from 'tweakpane'
import { GLParameters } from '../gl-helpers/gl'
// import { model } from '../arch/Model'

export function simulationPanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    parent.addButton({
        title: '...',
        label: 'Run',
    }).on('click', e => {
        console.log('running the model (todo)')
    })

}
