import {
    Group, Mesh, LineSegments, Points,
    MeshPhongMaterial, Color, DoubleSide
} from 'three'

import { DataFrame, Manager, Serie, array } from "@youwol/dataframe"
import { randColor } from './utils'
import * as kepler from "@youwol/kepler"
import { IOFactory } from '@youwol/io'
import { glParameters, createBasePlane, createDefaultLights } from './gl'
import { changeView } from './commands/changeView'

import {
    AreaDecomposer, ComponentDecomposer, EigenValuesDecomposer,
    EigenVectorsDecomposer, PositionDecomposer, VectorNormDecomposer, minMaxArray
} from "@youwol/math"

import {
    CurvatureDecomposer, NormalsToNodeDecomposer,
    TriangleToNodeDecomposer
} from "@youwol/geometry"

import { generateSkin } from './skins/Skin'
import { model } from './arch/Model'

// -----------------------------------------------------------------------

export function doOneSurface(url: URL, group: Group) {
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
    const filter = IOFactory.getFilter('test.ts')
    if (filter === undefined) {
        return
    }

    const dfs = filter.decode(buffer, { shared: false, merge: true, repair: true })
    dfs.forEach((df, i: number) => {
        const surface = new Surface()
        surface.generate(df)
        surface.surface.userData.surface = surface
        surface.surface.userData.isPickable = true
        surface.surface.name = `loaded-fault-${i + 1}`

        generateSkin(surface, "Points")
        generateSkin(surface, "Wireframe")
        generateSkin(surface, "Borders")
        generateSkin(surface, "BBox")
        
        group.add(surface.group)
        model.addObject(surface.surface)
    })

    createDefaultLights(group)
    createBasePlane(group)

    changeView('up', {
        scene: glParameters.scene,
        camera: glParameters.camera,
        controls: glParameters.controls,
        selection: glParameters.group
    })
}

export class Surface {
    manager: Manager = undefined
    group: Group = undefined
    positions: Serie = undefined
    indices: Serie = undefined
    private surface_: Mesh = undefined

    get surface() {
        return this.surface_
    }

    generate(grid: DataFrame) {
        if (!grid.series['positions'] || !grid.series['indices']) {
            return undefined
        }

        this.group = new Group()
        this.positions = grid.series['positions']
        this.indices = grid.series['indices']

        const df = DataFrame.create({
            series: grid.series
        })

        this.manager = new Manager(df, {
            decomposers: [
                new PositionDecomposer,       // x y z
                new ComponentDecomposer,      // Ux Uy Uz Sxx Sxy Sz Syy Syz Szz
                new VectorNormDecomposer,     // U
                new EigenValuesDecomposer,    // S1 S2 S3
                new EigenVectorsDecomposer,    // S1 S2 S3
                new NormalsToNodeDecomposer,
                new TriangleToNodeDecomposer({
                    positions: this.positions,
                    indices: this.indices,
                    decomposer: new AreaDecomposer
                }),
                new CurvatureDecomposer({
                    positions: this.positions,
                    indices: this.indices
                })
            ],
            dimension: 3
        })

        this.surface_ = this.createSurface({ color: randColor() })
        this.group.add(this.surface_)

        return this.group
    }

    attributeNames() {
        return this.manager.names(1)
    }

    scalar(name: string): Serie {
        return this.manager.serie(1, name)
    }

    displayAttributes(attrName: string) {
        let attr = this.manager.serie(1, attrName)
        if (attr) {
            const mM = minMaxArray(attr.array)
            console.log('attr :', attrName)
            console.log('min  :', mM[0].toFixed(3))
            console.log('max  :', mM[1].toFixed(3))
        }
    }

    private createSurface(
        { opacity = 1, color = "#aaaaaa", flat = false }:
            { opacity?: number, flat?: boolean, color?: string } = {}): Mesh {
        const s = kepler.createSurface({
            positions: this.positions,
            indices: this.indices,
            parameters: new kepler.SurfaceParameters({
                flat,
                wireframe: false,
                color,
                opacity
            }),
            material: new MeshPhongMaterial({
                color: new Color(color),
                flatShading: flat,
                vertexColors: false,
                shininess: 0,
                wireframe: false,
                side: DoubleSide,
                opacity
            })
        })

        s.castShadow = true
        s.receiveShadow = true
        return s
    }

    private createIsocontours = (
        { attribute, nb, spacing, list, filled = true, lined = true, opacity = 1, lut = "Insar", reverseLut = false }:
            { attribute: string, nb?: number, spacing?: number, list?: number[], filled?: boolean, lined?: boolean, opacity?: number, lut?: string, reverseLut?: boolean }): Mesh => {
        const attr = this.manager.serie(1, attribute)
        if (attr === undefined) {
            throw `Attribute named ${attribute} does not exist`
        }

        const minmax = array.minMax(attr.array)
        let min = minmax[0]
        let max = minmax[1]

        let isos = undefined
        if (spacing !== undefined) {
            isos = kepler.generateIsosBySpacing(min, max, spacing)
        }
        else if (nb !== undefined) {
            isos = kepler.generateIsos(min, max, nb)
        }
        else if (list !== undefined) {
            isos = kepler.generateIsos(min, max, list)
        }

        if (isos) {
            return kepler.createIsoContours(
                this.surface_,
                attr, {
                parameters: new kepler.IsoContoursParameters({
                    color: '#ffffff',
                    lineColor: '#000000',
                    isoList: isos,
                    filled,
                    lined,
                    opacity,
                    lut,
                    reverseLut,
                    min,
                    max
                })
            })
        }

        return undefined
    }

    private createFailurePlanes = (
        { stressAttribute = "stress", size = 1, sizeAttribute = undefined, attribute = undefined, color = 'aaaaaa', circle = true, borders = true, borderColor = "000000", type = 'joint' }:
            { stressAttribute?: string, size?: number, sizeAttribute?: string, attribute?: string, color?: string, circle?: boolean, borders?: boolean, borderColor?: string, type?: string } = {}
    ): Group => {
        if (stressAttribute !== undefined) {
            let fractureType = undefined
            switch (type) {
                case "dike":
                case "dyke":
                case "joint": fractureType = kepler.FractureType.JOINT; break
                case "fault": fractureType = kepler.FractureType.FAULT; break
                case "stylolite": fractureType = kepler.FractureType.STYLOLITE; break
                default: fractureType = kepler.FractureType.JOINT; break
            }

            // TODO ..................................

            /*
            const skin = kepler.createFailurePlanes({
                geometry: this.surface_.geometry,
                dataframe: df,
                parameters: new kepler.FailurePlanesParameters({
                    stress: stressAttribute,
                    size,
                    sizeAttribute,
                    paintAttribute: attribute,
                    color,
                    circle,
                    borders,
                    type: fractureType
                })
            })

            const group = new Group()
            group.add(skin)

            if (borders) {
                const skinb = kepler.createEdges(skin.geometry, new kepler.EdgesParameters({
                    thresholdAngle: 10,
                    color: borderColor
                }))
                group.add(skin)
            }

            return group
            */
        }

        return undefined
    }
}
