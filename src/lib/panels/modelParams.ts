import { Object3D } from 'three'
import { FolderApi } from 'tweakpane'
import { GLParameters } from '../gl'
import { model } from '../arch/Model'

export function modelParamsPanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    parent.addBinding(model, 'halfSpace', {label: 'Half-space'})
}
