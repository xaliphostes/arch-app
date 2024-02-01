import { clearModel } from "../commands/clearModel"
import { fitScene } from "../commands/fitScene"
import { glParameters } from '../gl-helpers/gl'

export function clearModelMenu() {
    const g = document.getElementById('clear-model')
    g.addEventListener('click', e => {
        
        clearModel()

        fitScene({
            scene: glParameters.scene,
            camera: glParameters.camera,
            controls: glParameters.controls
        })
    })
}
