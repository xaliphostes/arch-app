import { changeView } from '../commands/changeView'
import { clearModel } from '../commands/clearModel'
import { createBasePlane } from "../commands/createBasePlane"
import { createDefaultLights2 } from "../commands/createDefaultLights2"
import { glParameters } from '../gl-helpers/gl'
import { loadModel } from '../loaders/loadModel'

export function loadModelMenu() {
    const g = document.getElementById('load-model')
    g.addEventListener('click', e => {
        const setup = () => {
            const upload = document.createElement('input')
            upload.type = 'file'
            upload.id = 'upload'
            upload.style.display = "none"
            upload.accept = ".zip"
            document.body.appendChild(upload)
            upload.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files.item(0)

                clearModel()

                loadModel(file).finally(() => {
                    document.body.removeChild(upload)

                    createDefaultLights2(glParameters.scene)
                    createBasePlane(glParameters.scene)

                    changeView('up', {
                        scene: glParameters.scene,
                        camera: glParameters.camera,
                        controls: glParameters.controls,
                        selection: glParameters.scene
                    })

                    glParameters.scene.traverse(node => {
                        if (node.isMesh) {
                            node.castShadow = false
                        }
                    })
                })
            }
        }
        setup()
        document.getElementById('upload').click()
    })
}
