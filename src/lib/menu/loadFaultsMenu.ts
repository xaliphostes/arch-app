import { fitScene } from "../commands/fitScene"
import { glParameters } from '../gl-helpers/gl'
import { doOneSurfaceFromBuffer } from "../loaders/surfaces"


export function loadFaultsMenu() {
    const g = document.getElementById('load-faults')
    g.addEventListener('click', e => {
        const setup = () => {
            const upload = document.createElement('input')
            upload.type = 'file'
            upload.id = 'upload'
            upload.style.display = "none"
            document.body.appendChild(upload)
            upload.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files.item(0)
                file.text().then(s => {
                    doOneSurfaceFromBuffer(s, glParameters.group)
                    fitScene({
                        scene: glParameters.scene,
                        camera: glParameters.camera,
                        controls: glParameters.controls
                    })
                }).finally(() => {
                    document.body.removeChild(upload)
                })
            }
        }
        setup()
        document.getElementById('upload').click()
    })
}
