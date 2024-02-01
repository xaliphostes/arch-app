import JSZip from "jszip"
import { modalDialog } from "./modalDialog"

export function zipInfo(file: File) {
    const zip = new JSZip()

    return zip.loadAsync(file)
        .then(zip => {
            let html = ''

            zip.forEach((relativePath: string, file: JSZip.JSZipObject) => {
                if (!file.dir) {
                    if (!relativePath.startsWith('__MACOSX')) {
                        html += `<tr><td>${relativePath}</td></tr>`
                    }
                }
            })

            modalDialog(`<h2>Content of ${file.name}</h2>
                <table class="table">
                    <tbody>
                        ${html}
                    </tbody>
                </table>
            `)
        })
}

// zip.files['test1.xml'].async("string")