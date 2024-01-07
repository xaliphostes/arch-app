import { Object3D } from 'three'
import { FolderApi } from 'tweakpane'
import { GLParameters } from '../gl-helpers/gl'

export function bcPanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    if (!mesh) {
        return
    }

    const setupObject = mesh.userData.setup

    parent.addBinding(setupObject, 'active', { label: 'Active' });

    parent.addBinding(setupObject, 'bcx', {
        label: 'Constraint in dip',
        options: {
            Locked: 0,
            Free: 1
        }
    })
    parent.addBinding(setupObject, 'bcy', {
        label: 'Constraint in strike',
        options: {
            Locked: 0,
            Free: 1
        }
    })
    parent.addBinding(setupObject, 'bcz', {
        label: 'Constraint in normal',
        options: {
            Locked: 0,
            Free: 1
        }
    })
}
