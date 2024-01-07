import { Camera, WebGLRenderer, Scene, Raycaster, Vector2, Object3D } from 'three'
import { TrackballControls } from '@youwol/three-extra'
import { intersectedObject, isPickable } from './utils'
import { Pane } from 'tweakpane'
import { surfaceDisplay } from '../panels/surfaceDisplay'
import { glParameters } from './gl'
import { PLYExporter } from './PlyExporter'
import { GLTFExporter } from 'three-stdlib'
import { generatePanel } from '../panels/generatePanel'
// import { PLYExporter } from 'three-stdlib'

export class Picker2 {
    renderer: WebGLRenderer = undefined
    camera: Camera = undefined
    scene: Scene = undefined
    controls: TrackballControls = undefined
    canvas: HTMLElement = undefined
    renderFct: Function = undefined
    raycaster = new Raycaster()
    pointer = new Vector2()
    isActivated = false
    curSelection: Object3D = undefined
    panel: Pane = undefined

    constructor({ renderer, camera, scene, controls, renderFct, canvas = 'c' }) {
        this.renderer = renderer
        this.camera = camera
        this.scene = scene
        this.controls = controls
        this.renderFct = renderFct
        this.isActivated = false

        this.canvas = document.getElementById(canvas)
        this.activate(true)

        var saveData = (function () {
            var a = document.createElement("a") as any;
            document.body.appendChild(a);
            a.style = "display: none";
            return function (data, fileName) {
                var blob = new Blob([data], { type: "octet/stream" }),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());

        {
            const g = document.getElementById('fault-display')
            g.addEventListener('click', e => {
                this.displayPanel()
            })
        }

        {
            const g = document.getElementById('fault-export-ply')
            g.addEventListener('click', e => {
                if (this.curSelection !== undefined) {
                    // console.log(this.curSelection.geometry.attributes.position)
                    // console.log(this.curSelection.geometry.index)
                    const exporter = new PLYExporter()
                    exporter.parse(
                        this.curSelection,
                        data => {
                            saveData(data, 'test.ply')
                        }, {
                        binary: false,
                        excludeAttributes: ['color', 'normal', 'uv'],
                        littleEndian: true
                    }
                    )
                }
            })
        }

        {
            const g = document.getElementById('fault-export-gltf')
            g.addEventListener('click', e => {
                if (this.curSelection !== undefined) {
                    // console.log(this.curSelection.geometry.attributes.position)
                    // console.log(this.curSelection.geometry.index)
                    const exporter = new GLTFExporter()
                    exporter.parse(
                        this.curSelection,
                        data => {
                            saveData(data, 'test.gltf')
                        },
                        error => {
                            console.log(error)
                        }
                    )
                }
            })
        }
    }

    activate(b: boolean) {
        if (b === true && this.isActivated === false) {
            this.canvas.addEventListener('dblclick', this.onDblClick)
            this.isActivated = true
        }
        else if (b === false && this.isActivated === true) {
            this.canvas.removeEventListener('dblclick', this.onDblClick)
            this.isActivated = false
        }
    }

    onDblClick = (event: MouseEvent) => {
        const rect = this.renderer.domElement.getBoundingClientRect()
        this.pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1
        this.pointer.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1

        this.raycaster.setFromCamera(this.pointer, this.camera)
        const intersects = this.raycaster.intersectObjects(this.scene.children)

        if (intersects.length === 0) {
            this.hidePanel()
            this.curSelection = undefined
            glParameters.lastSelection = undefined
        }
        else {
            // The closest pickable object...
            const object = intersectedObject(intersects)
            if (object !== undefined) {
                if (object !== this.curSelection) {
                    this.curSelection = object
                    glParameters.lastSelection = object
                    this.displayPanel()
                }
                else {
                    // Do nothing as the panel is already here
                }
            }
            else {
                this.hidePanel()
                this.curSelection = undefined
                glParameters.lastSelection = undefined
            }
        }
    }

    hidePanel() {
        if (this.panel) {
            this.panel.dispose()
            this.panel = undefined
        }
    }

    displayPanel() {
        this.hidePanel()

        if (this.curSelection === undefined) {
            return
        }

        // const div = document.getElementById('object-display')
        // const parent = new Pane({
        //     container: div,
        //     title: 'Display'
        // })
        // parent.addBlade({
        //     view: 'text',
        //     label: 'Selected object',
        //     parse: (v) => String(v),
        //     value: this.curSelection.name
        // })
        // parent.element.style.top = '200px'
        // surfaceDisplay({
        //     mesh: this.curSelection,
        //     params: glParameters,
        //     parent
        // })
        // parent.addButton({
        //     title: 'Close'
        // }).on('click', e => {
        //     parent.dispose()
        //     this.panel = undefined
        // })

        // this.panel = parent
        generatePanel({
            panelName: 'surface-display',
            title: 'Surface display',
            panelDiv: 'fault-display-panel',
            mesh: this.curSelection
        })
    }

}
