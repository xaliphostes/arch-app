import { doOneSurfaceFromBuffer } from "../loaders"
import { Pane } from "tweakpane"
import { glParameters } from "../gl"
import { fitScene } from "../commands/fitScene"

export function createMenuFile() {
    const setup = () => {
        const upload = document.createElement('input')
        upload.type = 'file'
        upload.id  ='upload'
        upload.style.display = "none"
        document.body.appendChild(upload)
        upload.onchange = (event ) => {
            const file = (event.target as HTMLInputElement).files.item(0)
            file.text().then( s => {
                doOneSurfaceFromBuffer(s, glParameters.group)
                fitScene({
                    scene: glParameters.scene, 
                    camera: glParameters.camera, 
                    controls: glParameters.controls
                })
            }).finally( () => {
                document.body.removeChild(upload)
            })
          }
    }

    const parent = new Pane({
        title: "File",
        expanded: true,
        container: document.getElementById('file-menu')
    })

    parent.addButton({
        title: 'Upload fault(s)',
    }).on('click', () => {
        setup()
        document.getElementById('upload').click()
    })

    parent.addButton({
        title: 'Upload grid(s)',
    }).on('click', () => {
        // TODO
    })

    parent.addButton({
        title: 'Clear',
    }).on('click', () => {
        // TODO
    })
}