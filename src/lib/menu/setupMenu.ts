import { MenuBuilder } from "./MenuBuilder"
import { loadModelMenu } from "./loadModelMenu"
import { helpMenu } from "./helpMenu"
import { generateMenuForPanel } from "./generateMenuForPanel"
import { modelInfo } from "./modelInfo"
import { infoZipModelMenu } from "./infoZipModelMenu"
import { clearModelMenu } from "./clearModelMenu"
import { importObjectMenu } from "./importObjectMenu"
import { glParameters } from "../gl-helpers/gl"
import { ModelObjectType } from "../arch/Model"

// generateMenuForPanel({
//     panelName: 'surface-display',
//     title: 'Surface display',
//     menuDiv: 'fault-display', // existing
//     panelDiv: 'fault-display-panel' // will create
// })

export function setupMenu() {

    prepareDom()

    // ----------------------------------------------------

    loadModelMenu()
    infoZipModelMenu()
    importObjectMenu({elementName: 'import-faults', filters: '.ts, .gcd', parent: glParameters.faults, type: ModelObjectType.FAULT})
    importObjectMenu({elementName: 'import-cavities', filters: '.ts, .gcd', parent: glParameters.cavities, type: ModelObjectType.CAVITY})
    importObjectMenu({elementName: 'import-grids', filters: '.ts, .gcd, .xyz, .vs, .pl, .so', parent: glParameters.grids, type: ModelObjectType.GRID})
    importObjectMenu({elementName: 'import-wells', filters: '.pl, .xyz', parent: glParameters.grids, type: ModelObjectType.WELL})
    

    generateMenuForPanel({
        panelName: 'remote',
        title: 'Remote stress',
        menuDiv: 'model-remote-menu', // existing
        panelDiv: 'model-remote-panel' // will create
    })

    modelInfo()
    clearModelMenu()

    generateMenuForPanel({
        panelName: 'general',
        title: 'General',
        menuDiv: 'menu-general',
        panelDiv: 'general-display'
    })

    document.getElementById('view-tools').addEventListener('click', _ => {
        const e = document.getElementById('viewToolsMenu')
        e.hidden = !e.hidden
    })

    document.getElementById('view-roses').addEventListener('click', _ => {
        const e = document.getElementById('main-rose-container')
        e.hidden = !e.hidden
    })

    document.getElementById('view-helper').addEventListener('click', _ => {
        const e = document.getElementById('view-helper-container')
        e.hidden = !e.hidden
    })
}

function prepareDom() {
    const builder = new MenuBuilder('main-fluid-container')

    builder.append(`
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Files
        </a>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" id="load-model">Load ARCH model (zip)</a></li>
            <li><a class="dropdown-item" href="#" id="info-zip-model">Content of a ARCH model (zip)</a></li>

            <div class="dropdown-divider"></div>

            <li><a class="dropdown-item" href="#" id="import-faults">Import faults</a></li>
            <li><a class="dropdown-item" href="#" id="import-cavities">Import cavities</a></li>
            <li><a class="dropdown-item" href="#" id="import-grids">Import grids</a></li>
            <li><a class="dropdown-item" href="#" id="import-wells">Import wells</a></li>
        </ul>
    </li>`)

    builder.append(`
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Model
        </a>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" id="model-remote-menu">Remote</a></li>
            <li><a class="dropdown-item" href="#" id="model-info">Info</a></li>
            <div class="dropdown-divider"></div>
            <li><a class="dropdown-item" href="#" id="clear-model">Clear</a></li>
        </ul>
    </li>`)

    // builder.append(`
    // <li class="nav-item">
    //     <a class="nav-link" href="#" id="menu-general">Options</a>
    // </li>`)

    builder.append(`
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            View
        </a>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" id="menu-general"><strong>General</strong></a></li>
            <li><a class="dropdown-item" href="#" id="view-roses">Rose diagrams</a></li>
            <li><a class="dropdown-item" href="#" id="view-helper">Helper</a></li>
            <li><a class="dropdown-item" href="#" id="view-tools">Toolbar</a></li>
        </ul>
    </li>`)

    helpMenu(builder)
}