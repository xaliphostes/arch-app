import { Object3D, Group } from 'three'
import { ListBladeApi, FolderApi } from 'tweakpane'
import { ColorGUIHelper } from '../gl-helpers/utils'
import { GLParameters } from '../gl-helpers/gl'
import { minMaxArray } from '@youwol/math'
import { Surface, addBBox, addBorders, addPoints, addWireframe } from '../gl-helpers/Surface'
import { colorMapNames } from '@youwol/kepler'
import { scalar } from '../loaders/objectUtils'

type UpdateFunction = () => void

export function surfaceDisplay2(
    { mesh, params, parent }:
    { mesh: Surface, params: GLParameters, parent: FolderApi }): void
{
    if (!mesh) {
        return
    }

    const group = mesh as Group // why?
    
    const updatePainting = () => {
        let coloring = group.userData.coloring
        const serie = scalar(coloring.attribute.name, mesh)

        // TODO...
    }

    addBasicPanel(mesh, parent, updatePainting)
    addWireframePanel(mesh, parent)
    addPointsPanel(mesh, parent)
    addBBoxPanel(mesh, parent)
    addBordersPanel(mesh, parent)
    addContoursPanel(mesh, parent, updatePainting)
}

// ---------------------------------------------------------------------------------------------

function addBasicPanel(mesh: Surface, parent: FolderApi, update: UpdateFunction) {
    /*
    const material = mesh.plain.material
    const group = mesh as Group // why?

    parent.addBinding(group, 'visible', { label: 'Show' }).on('change', e => {
        group.userData.visi = e.value
        update()
    })
    parent.addBinding(material, 'flatShading', { label: 'Flat' }).on('change', () => material.needsUpdate = true)
    parent.addBinding(new ColorGUIHelper(material, 'color'), 'value', { label: 'Color' })
    */
}

function addWireframePanel(mesh: Surface, parent: FolderApi) {
    addWireframe(mesh)

    const group = Surface as Group

    const f = parent.addFolder({title: 'Wireframe'})
    f.addBinding(group.userData.wireframe, 'visible', { label: 'Show' })
    f.addBinding(new ColorGUIHelper(group.userData.wireframe.material, 'color'), 'value', { label: 'Color' })
    f.expanded = false
}

function addPointsPanel(mesh: Surface, parent: FolderApi) {
    addPoints(mesh)

    const group = Surface as Group

    const f = parent.addFolder({title: 'Points'})
    f.addBinding(group.userData.points, 'visible', { label: 'Show' })
    f.addBinding(new ColorGUIHelper(group.userData.points.material, 'color'), 'value', { label: 'Color' })
    f.addBinding(group.userData.points.material, 'size', {
        label: 'Size',
        format: v => v.toFixed(0)
    })
    f.expanded = false
}

function addBBoxPanel(mesh: Surface, parent: FolderApi) {
    addBBox(mesh)

    const group = Surface as Group

    const f = parent.addFolder({title: 'Bounding box'})
    f.addBinding(group.userData.bbox, 'visible', { label: 'Show' })
    f.addBinding(new ColorGUIHelper(group.userData.bbox.material, 'color'), 'value', { label: 'Color' })
    f.expanded = false
}

function addBordersPanel(mesh: Surface, parent: FolderApi) {
    addBorders(mesh)

    const group = Surface as Group

    const f = parent.addFolder({title: 'Borders'})
    f.addBinding(group.userData.borders, 'visible', { label: 'Show' })
    f.addBinding(new ColorGUIHelper(group.userData.borders.material, 'color'), 'value', { label: 'Color' })
    f.expanded = false
}

function addContoursPanel(mesh: Surface, parent: FolderApi, update: UpdateFunction) {
    const folder = parent.addFolder({title: 'Painting'})
    folder.expanded = true

    const group = mesh as Group

    let coloring = group.userData.coloring

    folder.addBinding(coloring, 'visible', { label: 'Paint attribute' }).on('change', e => {
        update()
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
        // updatePainting()
    })

    let names = mesh.scalarAttributeNames()
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
        update()
    })

    names = colorMapNames()
    const colormap = folder.addBlade({
        view: 'list',
        label: 'Color map',
        options: names.map(name => { return { text: name, value: name } }),
        value: coloring.colormap.name
    }) as ListBladeApi<string>
    colormap.on('change', (e) => {
        coloring.colormap.name = e.value
        update()
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
        update()
    })
    coloring.isocontours.panes.nb = a
    a.hidden = true

    const b = folder.addBinding(coloring.isocontours, 'filled', {label: 'Filled'}).on( 'change', e => {
        coloring.isocontours.filled = e.value
        update()
    })
    coloring.isocontours.panes.filled = b
    b.hidden = true

    const c = folder.addBinding(coloring.isocontours, 'lined', {label: 'Lines'}).on( 'change', e => {
        coloring.isocontours.lined = e.value
        update()
    })
    coloring.isocontours.panes.lined = c
    c.hidden = true
}

/*
function visibilityPlain(b: boolean, mesh: Surface, serie: Serie) {
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
*/