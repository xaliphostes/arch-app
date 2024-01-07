import { Pane } from "tweakpane"
import { PanelFactory } from "../panels/PanelFactory"
import { glParameters } from "../gl-helpers/gl"

export type MenuParameters = {
    panelName: string,
    title: string,
    menuDiv: string,
    panelDiv: string
}

export function generateMenu({ panelName, title, menuDiv, panelDiv }: MenuParameters) {
    const g = document.getElementById(menuDiv)

    if (g === null) {
        console.warn(`HTMLElement ${menuDiv} is unknown`)
        return
    }

    g.addEventListener('click', e => {
        const parentDiv: HTMLElement = document.getElementById('panels-container')

        const div = document.createElement('div')
        div.id = panelDiv
        div.style.zIndex = '2'
        div.style.padding = '5px'
        parentDiv.appendChild(div)

        const parent = new Pane({
            container: div,
            title
        })
        parent.element.style.top = '200px'

        if (PanelFactory.generate(panelName, { mesh: glParameters.lastSelection, params: glParameters, parent })) {
            parent.addButton({ title: 'Close' }).on('click', e => {
                parent.dispose()
                parentDiv.removeChild(div)
            })
        }
    })
}
