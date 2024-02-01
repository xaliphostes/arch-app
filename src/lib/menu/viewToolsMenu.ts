import { changeView } from "../commands/changeView"
import { glParameters } from "../gl-helpers/gl"

export function viewToolsMenu() {
    const div = document.createElement('div')
    div.id = 'viewToolsMenu'
    div.innerHTML =`
    <div class="tool-box" id="tool-bar" style="top: 80px; left: 5px; width: 30px">
        <div id="vt-top" class=" tool" style="padding-top: 3px;"><h4>U</h4></div>
        <div id="vt-bottom" class=" tool" style="padding-top: 3px;"><h4>D</h4></div>
        <div id="vt-east" class=" tool" style="padding-top: 3px;"><h4>N</h4></div>
        <div id="vt-west" class=" tool" style="padding-top: 3px;"><h4>S</h4></div>
        <div id="vt-north" class=" tool" style="padding-top: 3px;"><h4>E</h4></div>
        <div id="vt-south" class=" tool" style="padding-top: 3px;"><h4>W</h4></div>
        <button id="fullscreen" type="button" class="btn btn-primary" style="margin-top: 10px; opacity: 50%">Fullscreen</button>
    </div>`
    document.body.append(div)

    {
        document.getElementById('vt-top').addEventListener('click', e => {
            changeView('up', { scene: glParameters.scene, camera: glParameters.camera, controls: glParameters.controls })
        })
        document.getElementById('vt-bottom').addEventListener('click', e => {
            changeView('down', { scene: glParameters.scene, camera: glParameters.camera, controls: glParameters.controls })
        })
        document.getElementById('vt-east').addEventListener('click', e => {
            changeView('east', { scene: glParameters.scene, camera: glParameters.camera, controls: glParameters.controls })
        })
        document.getElementById('vt-west').addEventListener('click', e => {
            changeView('west', { scene: glParameters.scene, camera: glParameters.camera, controls: glParameters.controls })
        })
        document.getElementById('vt-north').addEventListener('click', e => {
            changeView('north', { scene: glParameters.scene, camera: glParameters.camera, controls: glParameters.controls })
        })
        document.getElementById('vt-south').addEventListener('click', e => {
            changeView('south', { scene: glParameters.scene, camera: glParameters.camera, controls: glParameters.controls })
        })
    }

    const g = document.getElementById('fullscreen')
        g.addEventListener('click', e => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        })
}