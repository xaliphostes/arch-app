import { MenuBuilder } from "./MenuBuilder"
import { permanentModalDialog } from "./modalDialog"

export function helpMenu(builder: MenuBuilder) {
    permanentModalDialog(body, builder)
}

const body = `
    <p>A model for Arch is simply a zip file containing the pertinent files to characterize a model. For instance, in the model zip file, two components are mandatory:</p>
            <ul>
                <li>a folder named <strong><span style="font-family: Courier">in</span></strong>
                <li>a <strong><span style="font-family: Courier">model.json</span></strong> file which describe the Arch model
            </ul>
            
            <p>Optionaly, a zip file can contain a <strong><span style="font-family: Courier">out</span></strong>
            folder with the N simulations for each 3D object. In this folder, the
            <strong><span style="font-family: Courier">forward</span></strong>
            is also optional, while the <strong><span style="font-family: Courier">simulations</span></strong> is
            used for fast computation of any simulation.
            </p>
            <p>Generally, the zip file have the following structure:</p>

<textarea style="font-family: Courier" rows="35" cols="53" wrap="off">
project
│   model.json (optional)
│   README.md (optional)
|   ... other user files
│
└─── in
|   └─── faults
│   │   NAME-1.ts
│   │   ...
|   |
|   └─── cavities
|   |   ...
|   |
|   └─── grids
│   |   NAME-1.vs/pl/ts/so
│   │   ...
│
└─── out
    |   inversion.json (optional)
    |
    └─── simulations
    |   └─── faults
    │   │   |   NAME-1.ts
    │   │   |   ...
    │   │   |
    |   └─── cavities
    │   │
    |   └─── grids
    │   │   |   NAME-1.vs/pl/ts/so
    │   │   |   ...
    │   │
    └─── forward
        └─── faults
        │   |   NAME-1.ts
        │   |   ...
        │   |
        └─── cavities
        │
        └─── grids
            |   NAME-1.vs/pl/ts/so
            |   ...
</textarea>`