import * as kepler from "@youwol/kepler"
import { Object3D, MeshPhongMaterial, Color, DoubleSide } from 'three'
import { ColoringState, generateSurfaceRepresentation } from '../Surface'
import { DataFrame } from '@youwol/dataframe'
import { randColor } from "../utils"
import { glParameters } from "../gl"

export type PaintState = {
    atVertex: boolean,
    color: string,
    flat: boolean,
    opacity: number,
    paintAttribute: boolean
}

export const defaultPaintState = (): PaintState => {
    return {
        atVertex: true,
        color: '#cccccc',
        flat: false,
        opacity: 1,
        paintAttribute: false
    }
}

export const plainRepresentation: generateSurfaceRepresentation = (dataframe: DataFrame, state: ColoringState): Object3D => {
    const positions = dataframe.series['positions']
    const indices = dataframe.series['indices']

    const plain = kepler.createSurface({
        positions: positions,
        indices: indices,
        parameters: new kepler.SurfaceParameters({
            flat: false,
            wireframe: false,
            color: state.plain.color,
            opacity: state.plain.opacity
        }),
        material: new MeshPhongMaterial({
            color: new Color(randColor()),
            flatShading: state.plain.flat,
            vertexColors: false,
            shininess: 0,
            wireframe: false,
            side: DoubleSide,
            opacity: state.plain.opacity
        })
    })
    plain.castShadow = glParameters.parameters.shadows
    plain.receiveShadow = glParameters.parameters.shadows

    if (state.plain.paintAttribute) {
        const attribute = dataframe.series[state.attribute.name]
        if (attribute) {
            kepler.paintAttribute(plain, attribute, new kepler.PaintParameters({
                lut: state.attribute.colormap.name,
                atVertex: true
                // TODO: constrained min/max
            }))
        }
    }

    return plain
}
