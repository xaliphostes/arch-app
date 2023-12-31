import { Group, Mesh, MeshPhongMaterial, Color, DoubleSide, Object3D } from 'three'
import { DataFrame, Manager, Serie, array } from "@youwol/dataframe"
import { randColor } from '../gl-helpers/utils'
import * as kepler from "@youwol/kepler"
import { IOFactory } from '@youwol/io'
import { glParameters } from '../gl-helpers/gl'
import { changeView } from '../commands/changeView'

import {
    AreaDecomposer, ComponentDecomposer, EigenValuesDecomposer,
    EigenVectorsDecomposer, PositionDecomposer, VectorNormDecomposer, minMax, minMaxArray
} from "@youwol/math"

import {
    CurvatureDecomposer, NormalsToNodeDecomposer,
    TriangleToNodeDecomposer,
    bbox
} from "@youwol/geometry"

import { model } from '../arch/Model'
import { createBasePlane } from '../commands/createBasePlane'
import { createDefaultLights2 } from '../commands/createDefaultLights2'
import { createDefaultLights } from '../commands/createDefaultLights'

/*

    Manager are created on the fly

    Group
        |_ Mesh
            |_ userData
                |_ dataframe
                |_ isPickable = true
                |_ type = 'fault'
                |_ visi = true
                |_ name
                |_ coloring (see top of 'surfaceDisplay.ts')
                |_ wireframe (skin)
                |_ points (skin)
                |_ bbox (skin)
                |_ borders (skin)
*/

// -----------------------------------------------------------------------

function addAttributeToSurface() {

}

export function doOneSurfaceFromURL(url: URL, group: Group) {
    const promise = fetch(url)
        .then(res => {
            if (res.ok) return res.text()
            return undefined
        })
        .then(buffer => {
            doOneSurfaceFromBuffer(buffer, group)
        })
    return promise
}

export function doOneSurfaceFromBuffer(buffer, group: Group) {
    if (!buffer) {
        return undefined
    }

    // const filter = IOFactory.getFilter(url)
    const filter = IOFactory.getFilter('a.ts') // fake filename in order to have the extension
    if (filter === undefined) {
        return
    }

    // Multiple dataframes
    const dfs = filter.decode(buffer, { shared: false, merge: true, repair: true })
    dfs.forEach((df, i: number) => {
        const surface = createSurface(df)
        surface.userData.isPickable = true
        surface.userData.visi = true
        surface.userData.type = 'fault'
        surface.name = `loaded-fault-${i + 1}`
        surface.userData.name = `loaded-fault-${i + 1}`

        group.add(surface)
        model.addObject(surface)
        glParameters.lights.getObjectByName('spotlight-1').target = surface // TODO: refactor
    })

    // TODO: move this part of code !!!!!!!!!!!!!!!!!!!!!!!

    createDefaultLights2(group)
    createBasePlane(group)
    changeView('up', {
        scene: glParameters.scene,
        camera: glParameters.camera,
        controls: glParameters.controls,
        selection: glParameters.group
    })

    glParameters.scene.traverse(node => {
        if (node.isMesh) {
            node.castShadow = true
        }
    })
}

export function attributeNames(mesh: Mesh): string[] {
    const mng = getManager(mesh)
    if (!mng) {
        return []
    }
    return mng.names(1)
}

export function scalar(name: string, mesh: Mesh): Serie {
    const mng = getManager(mesh)
    if (!mng) {
        return undefined
    }
    return mng.serie(1, name)
}

export function displayAttributeBounds(attrName: string, mesh: Mesh) {
    const mng = getManager(mesh)
    if (!mng) {
        return
    }

    let attr = mng.serie(1, attrName)
    if (attr) {
        const mM = minMaxArray(attr.array)
        console.log('attr :', attrName)
        console.log('min  :', mM[0].toFixed(3))
        console.log('max  :', mM[1].toFixed(3))
    }
}

export function getManager(mesh: Mesh): Manager {
    const df = mesh.userData.dataframe
    
    if (df === undefined) {
        return undefined
    }

    return new Manager(df, {
        decomposers: [
            new PositionDecomposer,       // x y z
            new ComponentDecomposer,      // Ux Uy Uz Sxx Sxy Sz Syy Syz Szz
            new VectorNormDecomposer,     // U
            new EigenValuesDecomposer,    // S1 S2 S3
            new EigenVectorsDecomposer,    // S1 S2 S3
            new NormalsToNodeDecomposer,
            new TriangleToNodeDecomposer({ // for interpolation
                positions: df.series['positions'],
                indices: df.series['indices'],
                decomposer: new AreaDecomposer
            }),
            new CurvatureDecomposer({       // Gauss curvatures
                positions: df.series['positions'],
                indices: df.series['indices']
            })
        ],
        dimension: 3
    })
}

// ------------ P R I V A T E

function createSurface(data: DataFrame, { opacity = 1, color = "#aaaaaa", flat = false }: { opacity?: number, flat?: boolean, color?: string } = {}): Object3D {
    if (!data.series['positions'] || !data.series['indices']) {
        return undefined
    }

    const positions = data.series['positions']
    const indices = data.series['indices']

    const b = bbox(positions)
    console.log('center:', b.center)
    console.log('x length:', b.xLength)
    console.log('y length:', b.yLength)
    console.log('z length:', b.zLength)

    const df = DataFrame.create({
        series: data.series
    })

    const surface = kepler.createSurface({
        positions: positions,
        indices: indices,
        parameters: new kepler.SurfaceParameters({
            flat,
            wireframe: false,
            color,
            opacity
        }),
        material: new MeshPhongMaterial({
            color: new Color(randColor()),
            flatShading: flat,
            vertexColors: false,
            shininess: 0,
            wireframe: false,
            side: DoubleSide,
            opacity
        })
    })

    surface.castShadow = glParameters.parameters.shadows
    surface.receiveShadow = glParameters.parameters.shadows
    surface.userData.dataframe = df

    return surface
}
