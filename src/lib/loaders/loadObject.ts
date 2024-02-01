import { IOFactory, getBaseName, getExtension } from '@youwol/io'
import { Group, Object3D } from 'three'
import { ModelObjectType, model } from '../arch/Model'
import { createSurface } from './createSurface'
import { modalDialog } from '../menu/modalDialog'
import { createPointset } from './createPointset'

// ------------------------------------------------------------------

enum ObjectType {
    POINT = 'Point',
    LINE = 'Line',
    SURFACE = 'Surface',
    VOLUME = 'Volume'
}

const objectTypeMap = new Map<string, ObjectType>()
objectTypeMap.set('vs', ObjectType.POINT)
objectTypeMap.set('xyz', ObjectType.POINT)
objectTypeMap.set('pl', ObjectType.LINE)
objectTypeMap.set('ts', ObjectType.SURFACE)
objectTypeMap.set('so', ObjectType.VOLUME)

// ------------------------------------------------------------------

export function loadObject(file: string, buffer: string, group: Group, modelType: ModelObjectType): Object3D {
    const name = getBaseName(file)
    const extension = getExtension(file)
    const objectType = objectTypeMap.get(extension)

    const filter = IOFactory.getFilter(file)
    if (!filter) {
        return undefined
    }

    const dfs = filter.decode(buffer, { shared: false, merge: true, repair: true })

    dfs.forEach((df, i: number) => {
        let object: Object3D = undefined
        switch (objectType) {
            case ObjectType.SURFACE:
                object = createSurface(df)
                break
            case ObjectType.POINT:
                object = createPointset(df, {size: 5, color: "#000000"})
                modelType = ModelObjectType.WELL
                break
            // case ObjectType.LINE:
            //     object = createLineset(df)
            //     modelType = ModelObjectType.WELL
            //     break
            default:
                modalDialog(`File format for ${file} not yet supported`)
                break
        }

        if (object) {
            object.name = name
            object.userData.type = modelType
            object.userData.isPickable = true
            // object.userData.visi = true
            object.userData.name = name
            object.userData.extension = extension

            // Check that if modelType is surface, then type is surface as well
            //
            if (modelType === ModelObjectType.FAULT || modelType === ModelObjectType.CAVITY) {
                if (objectType !== ObjectType.SURFACE) {
                    modalDialog(`The loaded object from file "${file}" is a fault or cavity but its type is not a triangulated surface`)
                }
            }

            group.add(object)

            // Add to ARCH model
            switch (modelType) {
                case ModelObjectType.FAULT: model.addFault(object); break
                case ModelObjectType.CAVITY: model.addCavity(object); break
                case ModelObjectType.GRID: model.addGrid(object); break
                case ModelObjectType.WELL: model.addWell(object); break
            }
        }

        return object
    })
}
