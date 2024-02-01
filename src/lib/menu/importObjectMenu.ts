import { ModelObjectType } from '../arch/Model'
import { changeView } from '../commands/changeView'
import { createBasePlane } from "../commands/createBasePlane"
import { createDefaultLights2 } from "../commands/createDefaultLights2"
import { glParameters } from '../gl-helpers/gl'
import { loadObject } from '../loaders/loadObject'
import { Group } from 'three'

export function importObjectMenu(
    { elementName, filters, parent, type }:
    { elementName: string, filters: string, parent: Group, type: ModelObjectType })
{
    const g = document.getElementById(elementName)
    g.addEventListener('click', e => {
        const setup = () => {
            const upload = document.createElement('input')
            upload.type = 'file'
            upload.id = 'upload'
            upload.style.display = "none"
            upload.accept = filters
            document.body.appendChild(upload)
            upload.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files.item(0)
                file.text().then(buffer => {
                    loadObject(file.name, buffer, parent, type)

                    document.body.removeChild(upload)

                    createDefaultLights2(glParameters.scene)
                    createBasePlane(glParameters.scene)

                    changeView('up', {
                        scene: glParameters.scene,
                        camera: glParameters.camera,
                        controls: glParameters.controls,
                        selection: glParameters.scene
                    })
                })
            }
        }
        setup()
        document.getElementById('upload').click()
    })
}
