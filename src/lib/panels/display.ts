import { Object3D } from 'three'
import { ListBladeApi, FolderApi } from 'tweakpane'
import { ColorGUIHelper } from '../utils'
import { GLParameters } from '../gl'
import { Surface } from '../loaders'
import { minMaxArray } from '@youwol/math'
import * as kepler from "@youwol/kepler"

export function displayPanel(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    const material = mesh.material

    parent.addBinding(mesh, 'visible', { label: 'Show' })
    parent.addBinding(material, 'flatShading', { label: 'Flat' }).on('change', () => material.needsUpdate = true)
    parent.addBinding(new ColorGUIHelper(material, 'color'), 'value', { label: 'Color' })

    {
        const surface = mesh.userData.surface as Surface
        if (surface !== undefined) {
            parent.addBlade({view: 'separator'})

            if (mesh.userData.coloring === undefined) {
                mesh.userData.coloring = {
                    visible: false,
                    attribute: 'z',
                    colormap: 'Insar',
                    // reverseColorMap: false,
                    atVertex: true,
                    min: '0',
                    max: '1'
                }
            }

            parent.addBinding(mesh.userData.coloring, 'visible', { label: 'Paint attribute' }).on('change', e => {
                if (e.value) {
                    kepler.paintAttribute(mesh, surface.scalar(mesh.userData.coloring.attribute), new kepler.PaintParameters({
                        lut: mesh.userData.coloring.colormap,
                        atVertex: mesh.userData.coloring.atVertex
                    }) )
                }
                else {
                    // TODO: unpaint
                    mesh.material.vertexColors = false
                    mesh.material.needsUpdate = true
                }
            })
            
            let names = surface.attributeNames()
            const attr = parent.addBlade({
                view: 'list',
                label: 'Attribute',
                options: names.map( name => {return {text: name, value: name}}),
                value: mesh.userData.coloring.attribute
            }) as ListBladeApi<string>
            attr.on('change', (e) => {
                mesh.userData.coloring.attribute = e.value
                const serie = surface.scalar(mesh.userData.coloring.attribute)

                const mM = minMaxArray(serie.array)
                mesh.userData.coloring.min = mM[0].toFixed(3)
                mesh.userData.coloring.max = mM[1].toFixed(3)
                console.log('attr :', e.value)
                console.log('min  :', mM[0].toFixed(3))
                console.log('max  :', mM[1].toFixed(3))

                kepler.paintAttribute(mesh, serie, new kepler.PaintParameters({
                    lut: mesh.userData.coloring.colormap,
                    atVertex: mesh.userData.coloring.atVertex
                }) )
                mesh.material.needsUpdate = true
            })

            names = kepler.colorMapNames()
            const colormap = parent.addBlade({
                view: 'list',
                label: 'Color map',
                options: names.map( name => {return {text: name, value: name}}),
                value: mesh.userData.coloring.colormap
            }) as ListBladeApi<string>
            colormap.on('change', (e) => {
                mesh.userData.coloring.colormap = e.value
                kepler.paintAttribute(mesh, surface.scalar(mesh.userData.coloring.attribute), new kepler.PaintParameters({
                    lut: mesh.userData.coloring.colormap,
                    atVertex: mesh.userData.coloring.atVertex
                }) )
                mesh.material.needsUpdate = true
            })

            parent.addBinding(mesh.userData.coloring, 'min', {label: 'Min'})
            parent.addBinding(mesh.userData.coloring, 'max', {label: 'Max'})
        }
    }

    // Now create the skin folders for the 'Display' panel ONLY
    mesh.children.forEach( skin => {
        if (skin.userData.panelCreator !== undefined) {
            skin.userData.panelCreator(skin, parent)
        }
    })
}