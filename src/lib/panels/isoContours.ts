import { Object3D } from 'three'
import { ListBladeApi, FolderApi } from 'tweakpane'
import { GLParameters } from '../gl'
import { Surface } from '../loaders'
import * as kepler from "@youwol/kepler"
import { minMaxArray } from '@youwol/math'
import { Serie } from '@youwol/dataframe'

export function isoContoursPanel(
    { mesh, params, parent }:
        { mesh: Object3D, params: GLParameters, parent: FolderApi }): void {
    const surface = mesh.userData.surface as Surface
    if (surface === undefined) {
        return
    }

    if (mesh.userData.isocontours === undefined) {
        mesh.userData.isocontours = {
            skin: undefined,
            params: {
                visible: false,
                attribute: 'z',
                colormap: 'Insar',
                nb: 20,
                filled: true,
                lined: true
            }
        }
    }

    const display = () => {
        const serie = surface.scalar(mesh.userData.isocontours.params.attribute)
        const mM = minMaxArray(serie.array)
        console.log('min  :', mM[0].toFixed(3))
        console.log('max  :', mM[1].toFixed(3))

        if (mesh.userData.isocontours.skin !== undefined) {
            mesh.parent.remove(mesh.userData.isocontours.skin)
            mesh.userData.isocontours.skin = undefined
        }

        if (!mesh.userData.isocontours.params.visible) {
            return
        }

        mesh.userData.isocontours.skin = kepler.createIsoContours(
            mesh,
            serie, {
            parameters: new kepler.IsoContoursParameters({
                color: '#ffffff',
                lineColor: '#000000',
                isoList: kepler.generateIsos(mM[0], mM[1], mesh.userData.isocontours.params.nb),
                filled: mesh.userData.isocontours.params.filled,
                lined: mesh.userData.isocontours.params.lined,
                lut: mesh.userData.isocontours.params.colormap,
                reverseLut: false
            })
        })
        mesh.parent.add(mesh.userData.isocontours.skin)
    }

    parent.addBinding(mesh.userData.isocontours.params, 'visible', { label: 'Show' }).on('change', e => {
        mesh.userData.isocontours.params.visible = e.value
        display()
    })

    // List attributes
    let names = surface.attributeNames()
    const attr = parent.addBlade({
        view: 'list',
        label: 'Attribute',
        options: names.map(name => { return { text: name, value: name } }),
        value: mesh.userData.isocontours.params.attribute
    }) as ListBladeApi<string>
    attr.on('change', (e) => {
        mesh.userData.isocontours.params.attribute = e.value
        display()
    })

    // List color tables
    names = kepler.colorMapNames()
    const colormap = parent.addBlade({
        view: 'list',
        label: 'Color map',
        options: names.map(name => { return { text: name, value: name } }),
        value: mesh.userData.isocontours.params.colormap
    }) as ListBladeApi<string>
    colormap.on('change', (e) => {
        mesh.userData.isocontours.params.colormap = e.value
        display()
    })

    parent.addBinding(mesh.userData.isocontours.params, 'nb', {
        label: 'Nb',
        min: 5,
        max: 100,
        step: 1,
        format: (v) => v.toFixed(0)
    }).on( 'change', e => {
        mesh.userData.isocontours.params.nb = e.value
        display()
    })

    parent.addBinding(mesh.userData.isocontours.params, 'filled', {label: 'Filled'}).on( 'change', e => {
        mesh.userData.isocontours.params.filled = e.value
        display()
    })

    parent.addBinding(mesh.userData.isocontours.params, 'lined', {label: 'Lines'}).on( 'change', e => {
        mesh.userData.isocontours.params.lined = e.value
        display()
    })
}