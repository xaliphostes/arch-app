import { MenuBuilder } from "./MenuBuilder"
import { clearModelMenu } from "./clearModelMenu"
import { generateMenu } from "./generateMenu"
import { loadFaultsMenu } from "./loadFaultsMenu"

export function setupMenu() {

    prepareDom() // see below

    // ------------------------------

    loadFaultsMenu()
    // loadGridsMenu()
    clearModelMenu()

    // ------------------------------
    
    generateMenu({
        panelName: 'material', 
        title: 'Material', 
        menuDiv: 'model-material-menu', // existing
        panelDiv: 'model-material-panel' // will create
    })

    generateMenu({
        panelName: 'remote', 
        title: 'Remote stress', 
        menuDiv: 'model-remote-menu', // existing
        panelDiv: 'model-remote-panel' // will create
    })

    generateMenu({
        panelName: 'model-parameters', 
        title: 'Other parameters', 
        menuDiv: 'model-other-menu', // existing
        panelDiv: 'model-other-panel' // will create
    })

    generateMenu({
        panelName: 'simulation', 
        title: 'Simulation', 
        menuDiv: 'model-simulation-menu', // existing
        panelDiv: 'model-simulation-panel' // will create
    })

    // ------------------------------

    generateMenu({
        panelName: 'surface-display', 
        title: 'Surface display', 
        menuDiv: 'fault-display', // existing
        panelDiv: 'fault-display-panel' // will create
    })
    
    generateMenu({
        panelName: 'boundary-conditions', 
        title: 'Boundary conditions', 
        menuDiv: 'fault-bc-menu', // existing
        panelDiv: 'fault-bc-panel' // will create
    })

    // ------------------------------

    generateMenu({
        panelName: 'general', 
        title: 'General', 
        menuDiv: 'menu-general', 
        panelDiv: 'general-display'
    })

    // ------------------------------

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
            <li><a class="dropdown-item" href="#" id="load-faults">Load faults (Gocad TS files)</a></li>
            <li><a class="dropdown-item" href="#">Load grids (Gocad TS files)</a></li>
        </ul>
    </li>`)

    builder.append(`
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Model
        </a>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" id="model-material-menu">Material</a></li>
            <li><a class="dropdown-item" href="#" id="model-remote-menu">Remote</a></li>
            <li><a class="dropdown-item" href="#" id="model-other-menu">Other</a></li>
            <li><a class="dropdown-item" href="#" id="model-simulation-menu">Simulation</a></li>
            <li>
                <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#" id="clear-model">Clear</a></li>
        </ul>
    </li>`)

    builder.append(`
    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Object
        </a>
        <ul class="dropdown-menu">

            <li><a class="dropdown-item" href="#" id="fault-export-ply">Export PLY</a></li>
            <li><a class="dropdown-item" href="#" id="fault-export-gltf">Export GLTF</a></li>
            <li><a class="dropdown-item" href="#" id="fault-edit">Edit</a></li>
            <li><a class="dropdown-item" href="#" id="fault-bc-menu">Boundary conditions</a></li>
        </ul>
    </li>`)

    builder.append(`
    <li class="nav-item">
        <a class="nav-link" href="#" id="menu-general">General</a>
    </li>`)
}
