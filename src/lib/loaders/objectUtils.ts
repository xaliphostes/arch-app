import { Mesh } from 'three'
import { Manager, Serie } from "@youwol/dataframe"

import {
    AreaDecomposer,
    ComponentDecomposer,
    EigenValuesDecomposer,
    EigenVectorsDecomposer, 
    PositionDecomposer, 
    VectorNormDecomposer,
    minMaxArray
} from "@youwol/math"

import {
    CurvatureDecomposer, 
    NormalsToNodeDecomposer,
    TriangleToNodeDecomposer
} from "@youwol/geometry"



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
