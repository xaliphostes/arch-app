import { zipInfo } from './zipInfo'

export function infoZipModelMenu() {
    const g = document.getElementById('info-zip-model')
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
                zipInfo(file).finally(() => {
                    document.body.removeChild(upload)
                })
            }
        }
        setup()
        document.getElementById('upload').click()
    })
}
