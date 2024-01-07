/*
    O B S O L E T E
*/

import { Object3D } from 'three'
import { FolderApi, ListBladeApi, Pane, TabApi, TextBladeApi } from "tweakpane"
import { GLParameters, glParameters } from "./gl-helpers/gl"

export type ContainerType = Pane | FolderApi

export type PanelCreator = (
    {mesh, params, parent}:
    {mesh: Object3D, params?: GLParameters, parent: FolderApi}
) => void

export type PanelCreatorParameter = {
    name: string,
    create: PanelCreator,
    isStatic: boolean
}

export class PanelsContainer {
    pcreators: Map<string, PanelCreatorParameter> = new Map()
    parent: Pane = undefined
    tabs: TabApi = undefined
    bladePanels: ListBladeApi<string> = undefined
    lastPanelName = ''
    folderPanel: FolderApi = undefined
    lastMesh: Object3D = undefined
    meshNameBlade: TextBladeApi<string> = undefined
    showObject = true

    constructor(
        {div, name, showObject = true}:
        {div: string, name: string, showObject?: boolean})
    {
        this.parent = new Pane({
            title: name,
            expanded: false,
            container: document.getElementById(div)
        })
        this.showObject = showObject
    }

    registerPanels(panels: PanelCreatorParameter[]) {
        const names: Array<{text: string, value: string}> = []

        panels.forEach( panel => {
            this.pcreators.set(panel.name, {name: panel.name, create: panel.create, isStatic: panel.isStatic})
            names.push({text: panel.name, value: panel.name})
        })

        this.lastPanelName = names[0].value

        this.bladePanels = this.parent.addBlade({
            view: 'list',
            label: 'Panels',
            options: names,
            value: this.lastPanelName
        }) as ListBladeApi<string>

        this.bladePanels.on('change', e => {
            this.lastPanelName = e.value
            this.displayPanel(this.lastMesh)
        })

        // console.log(this.bladePanels.options)

        if (this.showObject) {
            this.meshNameBlade = this.parent.addBlade({
                view: 'text',
                label: 'Selected object',
                parse: (v) => String(v),
                value: '-none-'
            }) as TextBladeApi<string>
        }

        this.displayPanel(undefined)
    }

    setExpanded(e: boolean) {
        this.parent.expanded = e
    }

    hide() {
        if (this.folderPanel) {
            this.folderPanel.dispose()
            if (this.showObject) {
                this.meshNameBlade.value = '-none-'
            }
            this.lastMesh = undefined
        }
    }

    displayPanel(mesh: Object3D) {
        const creator: PanelCreatorParameter  = this.pcreators.get(this.lastPanelName)

        if (creator.isStatic === true) {
            this.removeFolderAndCreate()
            creator.create({
                mesh: undefined, 
                params: glParameters, 
                parent: this.folderPanel
            })
        }

        if (mesh === undefined) {
            return
        }
        
        this.lastMesh = mesh
        if (this.showObject) {
            this.meshNameBlade.value = mesh.name
        }

        // Remove old one
        this.removeFolderAndCreate()

        // Create the new one (for the current mesh)
        creator.create({
            mesh, 
            params: glParameters, 
            parent: this.folderPanel
        })
    }

    private removeFolderAndCreate(): FolderApi {
        // Remove old one
        if (this.folderPanel !== undefined) {
            this.folderPanel.dispose()
            this.folderPanel = undefined
        }

        // Create the folder
        this.folderPanel = this.parent.addFolder({
            title: '',
        }) as FolderApi

        return this.folderPanel
    }
}