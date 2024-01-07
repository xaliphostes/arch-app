import { Object3D } from 'three'
import { ListBladeApi, FolderApi } from 'tweakpane'
import { ColorGUIHelper } from '../gl-helpers/utils'
import { GLParameters } from '../gl-helpers/gl'
// import { Surface } from '../loaders/surfaces'
import { minMaxArray } from '@youwol/math'
import * as kepler from "@youwol/kepler"
import { Serie } from '@youwol/dataframe'
import { attributeNames, scalar } from '../loaders/surfaces'

/*
    Parent
        Mesh -> display attribute
        IsoContours

Switch between them
*/

type Coloring = {
    type: string,
    visible: boolean,
    attribute: {
        name: string,
        min: number | string,
        max: number | string,
        userMinMax: boolean
    },
    colormap: {
        name: string,
        reversed: boolean
    },
    plain: {
        atVertex: boolean
    },
    isocontours: {
        skin: Object3D,
        nb: number,
        filled: boolean,
        lined: boolean,
        panes : {
            nb: any,
            filled: any,
            lined: any
        }

    }
}

export function surfaceDisplay(
    { mesh, params, parent }:
    { mesh: Object3D, params: GLParameters, parent: FolderApi }): void
{
    if (!mesh) {
        return
    }
    
    const updatePainting = () => {
        if (mesh.visible && !coloring.visible) {
            visibilityPlain(false, mesh, undefined, coloring)
            visibilityIso(false, mesh, undefined, coloring)
            return
        }

        mesh.visible = mesh.userData.visi

        const b = mesh.visible && coloring.visible

        if (b === false) {
            visibilityPlain(false, mesh, undefined, coloring)
            visibilityIso(false, mesh, undefined, coloring)
        }
        else {
            const serie = scalar(coloring.attribute.name, mesh)
            if (coloring.type === 'plain') {
                // mesh.visible = mesh.userData.visi
                visibilityPlain(true, mesh, serie, coloring)
                visibilityIso(false, mesh, serie, coloring)
            }
            else {
                // mesh.userData.visi = mesh.visible
                mesh.visible = false
                visibilityIso(true, mesh, serie, coloring)
                visibilityPlain(false, mesh, serie, coloring)
            }
        }
    }

    addBasic(mesh, parent, updatePainting)
    addWireframe(mesh, parent)
    addPoints(mesh, parent)
    addBBox(mesh, parent)
    addBorders(mesh, parent)
    
    const folder = parent.addFolder({title: 'Painting'})
    folder.expanded = true

    let coloring = mesh.userData.coloring as Coloring

    if (coloring === undefined) {
        coloring = mesh.userData.coloring = {
            type: 'plain', // or 'isocontours
            visible: false,
            attribute: {
                name: 'z',
                min: 0,
                max: 1,
                userMinMax: false
            },
            colormap: {
                name: 'Insar',
                reversed: false
            },
            plain: {
                atVertex: true
            },
            isocontours: {
                skin: undefined,
                nb: 20,
                filled: true,
                lined: true,
                panes: {
                    nb: undefined,
                    filled: undefined,
                    lined: undefined
                }
            }   
        } as Coloring
    }

    folder.addBinding(coloring, 'visible', { label: 'Paint attribute' }).on('change', e => {
        updatePainting()
    })

    const t = folder.addBlade({
        view: 'list',
        label: 'Type',
        options: [
          {text: 'Plain', value: 'plain'},
          {text: 'Iso-contours', value: 'iso'}
        ],
        value: coloring.type,
    }) as ListBladeApi<string>
    t.on('change', e => {
        coloring.type = e.value
        if (coloring.type === 'plain') {
            coloring.isocontours.panes.nb.hidden = true
            coloring.isocontours.panes.filled.hidden = true
            coloring.isocontours.panes.lined.hidden = true
        }
        else {
            coloring.isocontours.panes.nb.hidden = false
            coloring.isocontours.panes.filled.hidden = false
            coloring.isocontours.panes.lined.hidden = false
        }
        updatePainting()
    })

    let names = attributeNames(mesh)
    const attr = folder.addBlade({
        view: 'list',
        label: 'Attribute',
        options: names.map(name => { return { text: name, value: name } }),
        value: coloring.attribute.name
    }) as ListBladeApi<string>
    attr.on('change', (e) => {
        coloring.attribute.name = e.value
        const serie = scalar(coloring.attribute.name, mesh)
        const mM = minMaxArray(serie.array)
        coloring.attribute.min = mM[0].toFixed(3)
        coloring.attribute.max = mM[1].toFixed(3)
        updatePainting()
    })

    names = kepler.colorMapNames()
    const colormap = folder.addBlade({
        view: 'list',
        label: 'Color map',
        options: names.map(name => { return { text: name, value: name } }),
        value: coloring.colormap.name
    }) as ListBladeApi<string>
    colormap.on('change', (e) => {
        coloring.colormap.name = e.value
        updatePainting()
    })

    folder.addBinding(coloring.attribute, 'min', { label: 'Min' })
    folder.addBinding(coloring.attribute, 'max', { label: 'Max' })

    const a = folder.addBinding(coloring.isocontours, 'nb', {
        label: 'Nb',
        min: 5,
        max: 100,
        step: 1,
        format: (v) => v.toFixed(0)
    }).on( 'change', e => {
        coloring.isocontours.nb = e.value
        updatePainting()
    })
    coloring.isocontours.panes.nb = a
    a.hidden = true

    const b = folder.addBinding(coloring.isocontours, 'filled', {label: 'Filled'}).on( 'change', e => {
        coloring.isocontours.filled = e.value
        updatePainting()
    })
    coloring.isocontours.panes.filled = b
    b.hidden = true

    const c = folder.addBinding(coloring.isocontours, 'lined', {label: 'Lines'}).on( 'change', e => {
        coloring.isocontours.lined = e.value
        updatePainting()
    })
    coloring.isocontours.panes.lined = c
    c.hidden = true
}

// -------------------------------

function addBasic(mesh: Object3D, parent: FolderApi, update: Function) {
    const material = mesh.material

    parent.addBinding(mesh, 'visible', { label: 'Show' }).on('change', e => {
        mesh.userData.visi = e.value
        update()
    })
    parent.addBinding(material, 'flatShading', { label: 'Flat' }).on('change', () => material.needsUpdate = true)
    parent.addBinding(new ColorGUIHelper(material, 'color'), 'value', { label: 'Color' })
}

function addWireframe(mesh: Object3D, parent: FolderApi) {
    if (mesh.userData.wireframe === undefined) {
        // const surface = mesh.userData.surface as Surface

        const skin = kepler.createSurface({
            positions: mesh.userData.dataframe.series.positions,
            indices: mesh.userData.dataframe.series.indices,
            parameters: new kepler.SurfaceParameters({
                wireframe: true,
                color: '#000000',
                opacity: 1
            })
        })
        skin.visible = false
        skin.userData.pickable = false
        mesh.add(skin)
        mesh.userData.wireframe = skin
    }
    const f = parent.addFolder({title: 'Wireframe'})
    f.addBinding(mesh.userData.wireframe, 'visible', { label: 'Show' })
    f.addBinding(new ColorGUIHelper(mesh.userData.wireframe.material, 'color'), 'value', { label: 'Color' })
    f.expanded = false
}

function addPoints(mesh: Object3D, parent: FolderApi) {
    if (mesh.userData.points === undefined) {
        // const surface = mesh.userData.surface as Surface

        const skin = kepler.createPointset({
            position: mesh.userData.dataframe.series.positions,
            parameters: new kepler.PointsetParameters({
                size: 5,
                color: "#ff0000",
                sizeAttenuation: true
            })
        })
        skin.visible = false
        skin.userData.pickable = false
        mesh.add(skin)
        mesh.userData.points = skin
    }
    const f = parent.addFolder({title: 'Points'})
    f.addBinding(mesh.userData.points, 'visible', { label: 'Show' })
    f.addBinding(new ColorGUIHelper(mesh.userData.points.material, 'color'), 'value', { label: 'Color' })
    f.addBinding(mesh.userData.points.material, 'size', {
        label: 'Size',
        format: v => v.toFixed(0)
    })
    f.expanded = false
}

function addBBox(mesh: Object3D, parent: FolderApi) {
    if (mesh.userData.bbox === undefined) {
        const skin = kepler.createBBox(mesh, new kepler.BBoxParameters({ color: '#000000' }))
        skin.visible = false
        skin.userData.pickable = false
        mesh.add(skin)
        mesh.userData.bbox = skin
    }
    const f = parent.addFolder({title: 'Bounding box'})
    f.addBinding(mesh.userData.bbox, 'visible', { label: 'Show' })
    f.addBinding(new ColorGUIHelper(mesh.userData.bbox.material, 'color'), 'value', { label: 'Color' })
    f.expanded = false
}

function addBorders(mesh: Object3D, parent: FolderApi) {
    if (mesh.userData.borders === undefined) {
        const skin = kepler.createSurfaceBorders({
            mesh,
            parameters: new kepler.LinesetParameters({
                color: '#000000',
                useTube: false,
                tubeRadius: 1
            })
        })
        skin.visible = false
        skin.userData.pickable = false
        mesh.add(skin)
        mesh.userData.borders = skin
    }
    const f = parent.addFolder({title: 'Borders'})
    f.addBinding(mesh.userData.borders, 'visible', { label: 'Show' })
    f.addBinding(new ColorGUIHelper(mesh.userData.borders.material, 'color'), 'value', { label: 'Color' })
    f.expanded = false
}

function visibilityPlain(b: boolean, mesh: Object3D, serie: Serie, coloring: Coloring) {
    if (b) {
        kepler.paintAttribute(mesh, serie, new kepler.PaintParameters({
            lut: coloring.colormap.name,
            atVertex: true
        }))
    }
    else {
        // Unpaint
        mesh.material.vertexColors = false
        mesh.material.needsUpdate = true
    }
}

function visibilityIso(b: boolean, mesh: Object3D, serie: Serie, coloring: Coloring) {
    // unpaint
    if (coloring.isocontours.skin !== undefined) {
        mesh.parent.remove(coloring.isocontours.skin)
        coloring.isocontours.skin = undefined
    }

    if (b) {
        const mM = minMaxArray(serie.array)
        coloring.isocontours.skin = kepler.createIsoContours(
            mesh,
            serie, {
            parameters: new kepler.IsoContoursParameters({
                color: '#ffffff',
                lineColor: '#000000',
                isoList: kepler.generateIsos(mM[0], mM[1], coloring.isocontours.nb),
                filled: coloring.isocontours.filled,
                lined: coloring.isocontours.lined,
                lut: coloring.colormap.name,
                reverseLut: false
            })
        })
        mesh.parent.add(coloring.isocontours.skin)
    }
}