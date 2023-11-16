import { Object3D } from 'three'
import { FolderApi } from 'tweakpane'
import { GLParameters } from '../gl'
import { model } from '../arch/Model'

export function remotePanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    parent.addBinding(model.remote, 'sh')
    parent.addBinding(model.remote, 'sH')
    parent.addBinding(model.remote, 'sv')
    
    parent.addBinding(model.remote, 'theta', {
        label: 'Theta',
        min: 0,
        max: 180,
        step: 1
    })
}
