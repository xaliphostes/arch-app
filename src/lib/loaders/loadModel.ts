import { glParameters } from '../gl-helpers/gl'
import JSZip, { JSZipObject } from 'jszip'
import { fitScene } from '../commands/fitScene'
import { ModelObjectType, model } from '../arch/Model'
import { loadObject } from './loadObject'

export function loadModel(file: File): Promise<void> {
    const zip = new JSZip()

    // zip.files['test1.xml'].async("string")

    return zip.loadAsync(file) // file blob
        .then(zip => {

            // console.log(zip.files)

            model.filename = file.name
            model.size = file.size

            const date = new Date(file.lastModified)
            model.lastModified = date.toDateString()

            // Faults
            zip.folder('out/simulations/faults').forEach((file: string, o: JSZipObject) => {
                if (o.dir === false) {
                    if (!file.startsWith('__MACOSX')) {
                        o.async('string').then(content => {
                            // doOneSurfaceFromBuffer(content, glParameters.faults)
                            loadObject(file, content, glParameters.faults, ModelObjectType.FAULT)
                            fitScene({
                                scene: glParameters.scene,
                                camera: glParameters.camera,
                                controls: glParameters.controls
                            })
                        }, () => {
                        })
                    }
                }
            })

            // Grids
            zip.folder('out/simulations/grids').forEach((file: string, o: JSZipObject) => {
                if (o.dir === false) {
                    if (!file.startsWith('__MACOSX')) {
                        o.async('string').then(content => {
                            loadObject(file, content, glParameters.grids, ModelObjectType.GRID)
                            fitScene({
                                scene: glParameters.scene,
                                camera: glParameters.camera,
                                controls: glParameters.controls
                            })
                        }, () => {
                        })
                    }
                }
            })
        }, () => {
            alert("Not a valid zip file")
        })
}