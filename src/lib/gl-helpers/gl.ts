import { PerspectiveCamera, WebGLRenderer, Group, Scene, Fog, AmbientLight, SpotLight } from 'three'

import { TrackballControls, zoomToIntersection } from '@youwol/three-extra'

import { Picker2 } from './Picker2'
import { RenderFunctions } from './RenderFct'

import { Background } from './Background'
import { createBasePlane } from '../commands/createBasePlane'
import { createDefaultLights2 } from '../commands/createDefaultLights2'
import { ViewHelper2 } from './ViewHelper2'

export type GLParameters = {
    camera: PerspectiveCamera,
    scene: Scene,
    renderer: WebGLRenderer,
    controls: TrackballControls,
    renderFct: RenderFunctions,
    picker: Picker2,
    group: Group,
    helper: ViewHelper2,
    baseGrid: Group,
    lights: Group,
    parameters: {
        shadows: boolean
    },
    lastSelection: Group
}

export let glParameters = {
    camera: undefined,
    scene: undefined,
    renderer: undefined,
    controls: undefined,
    renderFct: undefined,
    picker: undefined,
    group: undefined,
    helper: undefined,
    baseGrid: undefined,
    lights: undefined,
    parameters: {
        shadows: true
    },
    lastSelection: undefined
} as GLParameters

// ------------------------------------------------------

export function initGl(
    { div, backgroundColor = 0xa5a5a5 }:
        { div: string, backgroundColor?: number }) {
    const canvas = document.getElementById(div)

    const renderer = new WebGLRenderer({
        canvas: canvas, antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = glParameters.parameters.shadows // !!!!!!!!!!! <================ !!!!!!!!!!!

    // Shift + dblclick => zoomToIntersection
    //
    renderer.domElement.addEventListener('dblclick', (event: MouseEvent) => {
        if (event.shiftKey) {
            zoomToIntersection({ scene, event, camera, controls })
            event.stopPropagation()
        }
    })

    glParameters.renderer = renderer

    const scene = new Scene()

    {
        const background = new Background({
            start: {
                color: '#000000',
                pos: 1
            },
            stop: {
                color: '#000000',
                pos: 0
            }
        })

        background.addIndex({
            color: '#222222',
            pos: 0.5
        })

        scene.background = background.generate()
    }

    glParameters.scene = scene

    const group = new Group()
    group.name = 'MainGroup'
    group.userData.pickable = false
    glParameters.group = group
    scene.add(group)

    const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100000)
    camera.position.z = 3
    glParameters.camera = camera

    const controls = new TrackballControls(camera, renderer.domElement)
    glParameters.controls = controls

    createBasePlane(undefined)
    createDefaultLights2(undefined)

    const renderFct = new RenderFunctions({ renderer, scene, camera })
    glParameters.renderFct = renderFct

    const picker = new Picker2({
        renderer,
        camera,
        scene,
        controls,
        renderFct
    })
    glParameters.picker = picker

    const helper = new ViewHelper2(camera, renderer)
    helper.setControls(controls)
    glParameters.helper = helper

    window.addEventListener('resize', updateSize)
}

export function animate() {
    render()
    requestAnimationFrame(animate)
}

function render() {
    glParameters.controls.update()
    updateSize()
    glParameters.renderer.render(glParameters.scene, glParameters.camera)
    glParameters.helper.render()
}

function updateSize() {
    const width = window.innerWidth
    const height = window.innerHeight
    glParameters.camera.aspect = width / height
    glParameters.camera.updateProjectionMatrix()
    glParameters.renderer.setSize(width, height)
    glParameters.helper.update();
    glParameters.helper.updateOrientation();
}
