import { fitScene } from "../commands/fitScene"
import { glParameters } from '../gl-helpers/gl'

export function clearModelMenu() {
    const g = document.getElementById('clear-model')
    g.addEventListener('click', e => {
        glParameters.group.clear()

        fitScene({
            scene: glParameters.scene,
            camera: glParameters.camera,
            controls: glParameters.controls
        })
    })
}
