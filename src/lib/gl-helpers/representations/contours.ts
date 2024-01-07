import * as kepler from "@youwol/kepler"
import { Object3D } from 'three'
import { DataFrame } from "@youwol/dataframe"
import { ColoringState, createFakeMesh, generateSurfaceRepresentation } from "../Surface"
import { minMaxArray } from "@youwol/math"

export type ContoursState = {
    nb: number,
    filled: boolean,
    lined: boolean,

    panes: { // TODO: to be removed!!!
        nb: any,
        filled: any,
        lined: any
    }
}

export const defaultContoursState = (): ContoursState => {
    return {
        nb: 20,
        filled: true,
        lined: true,
        panes: {
            nb: undefined,
            filled: undefined,
            lined: undefined
        }
    }
}

export const contoursRepresentation: generateSurfaceRepresentation = (dataframe: DataFrame, state: ColoringState): Object3D => {
    const positions = dataframe.series['positions']
    const indices = dataframe.series['indices']
    const attribute = dataframe.series[state.attribute.name]

    // tmp. Need refact kepler for iso
    const mesh = createFakeMesh(positions, indices)

    const mM = minMaxArray(attribute.array)
    const contours = kepler.createIsoContours(
        mesh,
        attribute, {
        parameters: new kepler.IsoContoursParameters({
            color: '#ffffff',
            lineColor: '#000000',
            isoList: kepler.generateIsos(mM[0], mM[1], state.isocontours.nb),
            filled: state.isocontours.filled,
            lined: state.isocontours.lined,
            lut: state.attribute.colormap.name,
            reverseLut: false
        })
    })

    return contours
}