import { Object3D } from 'three'
import { FolderApi } from 'tweakpane'
import { GLParameters } from '../gl-helpers/gl'
import { model } from '../arch/Model'

export function materialPanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    parent.addBinding(model.material, 'poisson')
    parent.addBinding(model.material, 'young')
    parent.addBinding(model.material, 'density')
}
