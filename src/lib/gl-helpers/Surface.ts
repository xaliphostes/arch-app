import { DataFrame, Serie, Manager } from '@youwol/dataframe'
import * as kepler from "@youwol/kepler"
import { Object3D, Group, Mesh, MeshPhongMaterial, Color, DoubleSide } from 'three'
import { bbox } from "@youwol/geometry"
import { glParameters } from './gl'
import { randColor } from './utils'
import { minMaxArray } from '@youwol/math'

import {
    AreaDecomposer, ComponentDecomposer, EigenValuesDecomposer,
    EigenVectorsDecomposer, PositionDecomposer, VectorNormDecomposer
} from "@youwol/math"

import {
    CurvatureDecomposer, NormalsToNodeDecomposer,
    TriangleToNodeDecomposer
} from "@youwol/geometry"

/**
 * TODO: Add a json state for each representation
 */
export type ColoringState = {
    type: string, // 'plain', 'contours', ...
    visible: boolean, // should be removed

    attribute: {
        name: string,
        min: number | string,
        max: number | string,
        userMinMax: boolean,
        colormap: {
            name: string,
            reversed: boolean
        }
    },

    plain: {
        atVertex: boolean,
        color: string,
        flat: boolean,
        opacity: number,
        paintAttribute: boolean
    },

    isocontours: {
        nb: number,
        filled: boolean,
        lined: boolean,
        panes: { // to be removed
            nb: any,
            filled: any,
            lined: any
        }
    }
}

// Exclusive representation generator
export type generateSurfaceRepresentation = (dataframe: DataFrame, state: ColoringState) => Object3D


/**
 * A Surface encapsulate one to many disjoint representations. Disjoint representation cannot be
 * plotted together and therefore one has to be active.
 * 
 * Two basic representation are provided by default: "plain" and "contours".
 * The current representation is "plain".
 * 
 * Example
 * @example
 * ```js
 * const s = new Surface(dataframe)
 * s.switchTo('contours')
 * ... later on ...
 * s.switchTo('plain')
 * ```
 */
export class Surface extends Group {
    private dataframe: DataFrame = undefined
    private manager: Manager = undefined
    private representations: Map<string, generateSurfaceRepresentation> = new Map() // exclusive representations
    private mainRepresentation: generateSurfaceRepresentation = undefined

    state: ColoringState = {
        type: 'plain', // or 'isocontours'
        visible: false,

        attribute: {
            name: 'z',
            min: 0,
            max: 1,
            userMinMax: false,
            colormap: {
                name: 'Insar',
                reversed: false
            }
        },
        plain: {
            atVertex: true,
            color: '#cccccc',
            flat: false,
            opacity: 1,
            paintAttribute: false
        },
        isocontours: {
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

    constructor(data: DataFrame, { opacity = 1, color = "#aaaaaa", flat = false }: { opacity?: number, flat?: boolean, color?: string } = {}) {
        super()

        this.state.plain.color = color
        this.state.plain.flat = flat
        this.state.plain.opacity = opacity

        if (!data.series['positions'] || !data.series['indices']) {
            return undefined
        }

        this.dataframe = DataFrame.create({
            series: data.series
        })

        this.generateManager()
        this.displayInfo()

        this.addRepresentation('plain', plainRepresentation)
        this.addRepresentation('contours', contoursRepresentation)
    }

    /**
     * Why to we have to do that?
     * It seems that vs-code don't understand that Surface inherits from Group!
     */
    get group(): Group {
        return this as Group
    }

    get positions() {
        return this.dataframe.series['positions']
    }

    get indices() {
        return this.dataframe.series['indices']
    }

    addRepresentation(name: string, gen: generateSurfaceRepresentation) {
        this.representations.set(name, gen)

        // The first entered representation is the default one (can be changed afterward)
        if (this.mainRepresentation === undefined) {
            this.mainRepresentation = gen
        }
    }

    setDefaultRepresentation(name: string) {
        this.mainRepresentation = this.representations.get(name)
    }

    switchTo(type: string) {
        const gen = this.representations.get(type)

        if (gen) {
            this.removeCurrentRepresentation()
            const rep = gen(this.dataframe, this.state)
            if (rep) {
                rep.userData.isCurrentRep = true // !!! <------------------
                this.group.add(rep)
            }
        }
        else {
            console.error(`Cannot find a representation named ${type}`)
        }
    }

    getAttribute(): Serie {
        return this.dataframe.series[this.state.attribute.name]
    }

    scalarAttributeNames(): string[] {
        if (!this.manager) {
            return []
        }
        return this.manager.names(1)
    }

    vectorAttributeNames(): string[] {
        if (!this.manager) {
            return []
        }
        return this.manager.names(3)
    }

    matrixAttributeNames(): string[] {
        if (!this.manager) {
            return []
        }
        return this.manager.names(6)
    }

    scalar(name: string): Serie {
        return this.attribute(name, 1)
    }

    vector(name: string): Serie {
        return this.attribute(name, 3)
    }

    matrix(name: string): Serie {
        return this.attribute(name, 6) // sym
    }

    private removeCurrentRepresentation() {
        // Remove the current represention ONLY
        // WARNING: This Group can have other children
        this.group.traverse((child: Object3D) => {
            if (child.userData.isCurrentRep === true) {
                child.removeFromParent()
            }
        })
    }

    private displayInfo() {
        const b = bbox(this.positions)
        console.log('center:', b.center, '\nx length:', b.xLength, '\ny length:', b.yLength, '\nz length:', b.zLength)
    }

    private generateManager() {
        const df = this.group.dataframe

        if (df === undefined) {
            return undefined
        }

        this.manager = new Manager(df, {
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

    private attribute(name: string, dim: number): Serie {
        if (!this.manager) {
            return undefined
        }
        return this.manager.serie(dim, name)
    }
}

// ---------------------------------------------------------

// A first disjoint representation
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

// A second disjoint representation
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

// ---------------------------------------------------------

// Other non-disjoint representations

export function addWireframe(mesh: Surface) {
    const group = mesh as Group // why ?

    if (group.userData.wireframe === undefined) {
        const skin = kepler.createSurface({
            positions: mesh.positions,
            indices: mesh.indices,
            parameters: new kepler.SurfaceParameters({
                wireframe: true,
                color: '#000000',
                opacity: 1
            })
        })
        skin.visible = false
        skin.userData.pickable = false
        group.add(skin)
        group.userData.wireframe = skin
    }
}

export function addPoints(mesh: Surface) {
    const group = mesh as Group // why ?

    if (group.userData.points === undefined) {
        const skin = kepler.createPointset({
            position: mesh.positions,
            parameters: new kepler.PointsetParameters({
                size: 5,
                color: "#ff0000",
                sizeAttenuation: true
            })
        })
        skin.visible = false
        skin.userData.pickable = false
        group.add(skin)
        group.userData.points = skin
    }
}

export function addBBox(mesh: Surface) {
    const group = mesh as Group // why ?

    if (group.userData.bbox === undefined) {
        const skin = kepler.createBBox(createFakeMesh(mesh.positions, mesh.indices), new kepler.BBoxParameters({ color: '#000000' }))
        skin.visible = false
        skin.userData.pickable = false
        group.add(skin)
        group.userData.bbox = skin
    }
}

export function addBorders(mesh: Surface) {
    const group = mesh as Group // why ?

    if (group.userData.borders === undefined) {
        const skin = kepler.createSurfaceBorders({
            mesh: createFakeMesh(mesh.positions, mesh.indices),
            parameters: new kepler.LinesetParameters({
                color: '#000000',
                useTube: false,
                tubeRadius: 1
            })
        })
        skin.visible = false
        skin.userData.pickable = false
        group.add(skin)
        group.userData.borders = skin
    }
}

// ---------------------------------------------------------

export function createFakeMesh(positions: Serie, indices: Serie): Mesh {
    return new Mesh(
        kepler.createBufferGeometry(positions, indices), 
        new MeshPhongMaterial({color: new Color('#ffffff')})
    )
}
