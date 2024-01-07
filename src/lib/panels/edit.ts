import { Object3D } from 'three'
import { ListBladeApi, FolderApi } from 'tweakpane'
import { Transformer } from '../gl-helpers/Transformer'
import { GLParameters, glParameters } from '../gl-helpers/gl'
import { App } from '../App'

export function editPanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    if (!mesh) {
        return
    }
    
    const e = document.getElementById('tool-bar')
    e.hidden = false

    // Geometry edition...
    let mode = 'translate'
    const b = parent.addBlade({
        view: 'list',
        label: 'Mode',
        options: [
            { text: 'Translate', value: 'translate' },
            { text: 'Scale', value: 'scale' },
            { text: 'Rotate', value: 'rotate' }
        ],
        value: 'translate'
    }) as ListBladeApi<string>
    b.on('change', (e) => {
        mode = e.value
    })

    const isStarted = mesh.userData.transform !== undefined

    {
        const btn = parent.addButton({
            title: isStarted ? 'Stop' : 'Start',
            label: 'Geometry'
        })
        btn.on('click', () => {
            if (mesh.userData.transform === undefined) {
                const transform = new Transformer({
                    camera: params.camera,
                    renderer: params.renderer,
                    scene: params.scene,
                    controls: params.controls,
                    renderFct: params.renderFct,
                    mode
                })
                transform.attach(mesh)
                btn.title = 'Stop'
            }
            else {
                mesh.userData.transform.detach(mesh)
                mesh.userData.transform = undefined
                btn.title = 'Start'
            }
        })
    }
    {
        const btn = parent.addButton({
            title: 'Delete',
            label: 'Delete'
        })
        btn.on('click', () => {
            if (mesh !== undefined) {
                glParameters.group.remove(mesh)
                // App.objectPanel().hide()
            }
        })
    }
}
