import { Object3D } from 'three'
import { FolderApi } from 'tweakpane'
import { GLParameters, glParameters } from '../gl-helpers/gl'
import { gradedBackground } from '../gl-helpers/Background'

export function generalPanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    const f1 = parent.addFolder({title: 'Background'})
    f1.addBinding(gradedBackground.start, 'color', { label: 'Color top' }).on( 'change', e => {
        glParameters.scene.background = gradedBackground.generate()
    })
    f1.addBinding(gradedBackground.stop, 'color', { label: 'Color bottom' }).on( 'change', e => {
        glParameters.scene.background = gradedBackground.generate()
    })
    f1.addBinding(glParameters.scene, 'scale', { label: 'Scaling' }).on( 'change', e => {
    })

    const f2 = parent.addFolder({title: 'Grid'})
    f2.addBinding(glParameters.baseGrid, 'visible', {label: 'Show'})

    const f4 = parent.addFolder({title: 'Shadows'})
    f4.addBinding(glParameters.parameters, 'shadows', {label: 'Show'}).on('change', e => {
        glParameters.renderer.shadowMap.enabled = e.value
        glParameters.scene.traverse( node => {
            if (node.isMesh) {
                node.castShadow = e.value
            }
        })
        glParameters.lights.traverse( node => {
            if (node.shadow) {
                node.castShadow = e.value
            }
        })
        glParameters.baseGrid.traverse( node => {
            if (node.name === 'grid-plane') {
                node.receiveShadow = e.value
            }
        })
    })
    
    const f3 = parent.addFolder({title: 'Camera'})
    f3.addBinding(glParameters.camera, 'fov', {
        label: 'Field of iew',
        min: 1,
        max: 200,
        step: 1,
        format: v => v.toFixed(0)
    })

    // const f5 = parent.addFolder({title: 'Light 1'})
    // f5.addBinding(glParameters.lights.getObjectByName('light-1'), 'position')
    // f5.addBinding(glParameters.lights.getObjectByName('light-1'), 'intensity')
    // f5.addBinding(glParameters.lights.getObjectByName('light-1').shadow, 'radius')
    // f5.addBinding(glParameters.lights.getObjectByName('light-1').shadow, 'bias')

    // const f6 = parent.addFolder({title: 'Light 2'})
    // f6.addBinding(glParameters.lights.getObjectByName('light-2'), 'position')
    // f6.addBinding(glParameters.lights.getObjectByName('light-1'), 'intensity')
    // f6.addBinding(glParameters.lights.getObjectByName('light-2').shadow, 'radius')
    // f6.addBinding(glParameters.lights.getObjectByName('light-2').shadow, 'bias')

    const f5 = parent.addFolder({title: 'Light 1'})
    f5.addBinding(glParameters.lights.getObjectByName('spotlight-1'), 'position')
    f5.addBinding(glParameters.lights.getObjectByName('spotlight-1'), 'intensity')
    f5.addBinding(glParameters.lights.getObjectByName('spotlight-1'), 'distance')
    f5.addBinding(glParameters.lights.getObjectByName('spotlight-1'), 'angle')
    f5.addBinding(glParameters.lights.getObjectByName('spotlight-1'), 'penumbra')
    f5.addBinding(glParameters.lights.getObjectByName('spotlight-1'), 'decay')
    // f5.addBinding(glParameters.lights.getObjectByName('spotlight-1').shadow, 'radius')
    // f5.addBinding(glParameters.lights.getObjectByName('spotlight-1').shadow, 'bias')
}
