import { Pane } from "tweakpane"
import { PanelFactory } from "./PanelFactory"
import { glParameters } from "../gl-helpers/gl"
import { Mesh } from 'three'

export type PanelParameters = {
    panelName: string,
    title: string,
    panelDiv: string,
    mesh: Mesh
}

export function generatePanel(params: PanelParameters) {
    const parentDiv: HTMLElement = document.getElementById('panels-container')

    const div = document.createElement('div')
    div.id = params.panelDiv
    div.style.zIndex = '2'
    div.style.padding = '5px'
    parentDiv.appendChild(div)

    // const div = document.getElementById(panelDiv)
    const parent = new Pane({
        container: div,
        title: params.title
    })
    parent.element.style.top = '200px'

    if (PanelFactory.generate(params.panelName, { mesh: params.mesh, params: glParameters, parent })) {
        parent.addButton({ title: 'Close' }).on('click', e => {
            parent.dispose()
            parentDiv.removeChild(div)
        })
    }
}
