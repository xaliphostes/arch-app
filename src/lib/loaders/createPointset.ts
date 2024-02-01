import { Color, Object3D, PointsMaterial } from 'three'
import { DataFrame } from "@youwol/dataframe"
import { randColor } from '../gl-helpers/utils'
import * as kepler from "@youwol/kepler"
import { glParameters } from '../gl-helpers/gl'
import { bbox } from "@youwol/geometry"

export function createPointset(data: DataFrame, { size = 1, color = "#aaaaaa"}: { size?: number, color?: string } = {}): Object3D {
    if (!data.series['positions']) {
        return undefined
    }

    const positions = data.series['positions']

    const df = DataFrame.create({
        series: data.series
    })

    const surface = kepler.createPointset({
        position: positions,
        parameters: new kepler.PointsetParameters({
            color,
            size
        })
    })

    surface.castShadow = glParameters.parameters.shadows
    surface.receiveShadow = glParameters.parameters.shadows
    surface.userData.dataframe = df

    return surface
}