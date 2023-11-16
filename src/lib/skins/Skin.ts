import { Object3D } from 'three'
import { FolderApi, Pane } from 'tweakpane'
import { Surface } from '../loaders'

export type Skin = {
    createObject: (parent: Surface) => Object3D,
    createPanel: (object: Object3D, parent: Pane) => FolderApi
}

export namespace SkinFactory {
    const map_: Map<string, Skin> = new Map()
    export const bind = (skin: Skin, name: string = '') => map_.set(name, skin)
    export const get = (name: string): Skin => map_.get(name)
    export const exists = (name: string): boolean => map_.get(name) !== undefined
    export const names = (): string[] => Array.from(map_.keys())
    export const name = (data: Skin): string => data.constructor.name
}

export function generateSkin(parent: Surface, name: string): Object3D {
    if (SkinFactory.exists(name)) {
        const creator: Skin = SkinFactory.get(name)
        const skin = creator.createObject(parent)
        skin.userData.panelCreator = creator.createPanel
        parent.surface.add(skin)
        return skin
    }
    return undefined
}