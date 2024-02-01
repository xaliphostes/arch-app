import { MeshPhongMaterial, Color, DoubleSide, Object3D } from 'three'
import { DataFrame } from "@youwol/dataframe"
import { randColor } from '../gl-helpers/utils'
import * as kepler from "@youwol/kepler"
import { glParameters } from '../gl-helpers/gl'
import { bbox } from "@youwol/geometry"

export function createSurface(data: DataFrame, { opacity = 1, color = "#aaaaaa", flat = false }: { opacity?: number, flat?: boolean, color?: string } = {}): Object3D {
    if (!data.series['positions'] || !data.series['indices']) {
        return undefined
    }

    const positions = data.series['positions']
    const indices = data.series['indices']

    // const b = bbox(positions)
    // console.log('center:', b.center)
    // console.log('x length:', b.xLength)
    // console.log('y length:', b.yLength)
    // console.log('z length:', b.zLength)

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