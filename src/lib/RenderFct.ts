import { Camera, WebGLRenderer, Scene, MathUtils } from 'three'

export type RenderFunction = (renderer?: WebGLRenderer) => void

export class RenderFunctions {
    constructor({renderer, scene, camera}:{renderer: WebGLRenderer, scene: Scene, camera: Camera}) {
        this.renderer = renderer
        this.scene    = scene
        this.camera   = camera
    }

    add(render: RenderFunction): string {
        const uuid = MathUtils.generateUUID()
        this.stack.push({uuid, renderFct: render})
        return uuid
    }

    remove(uuid: string): boolean {
        for (let i = 0; i<this.stack.length; i++) {
            if ( this.stack[i].uuid === uuid) { 
                this.stack.splice(i, 1)
                return true
            }
        }
        return false
    }

    render = () => {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera )
        this.stack.forEach( item => {
            item.renderFct(this.renderer)
        })
        this.renderer.clearDepth()
    }

    private stack: Array<RenderItem> = []
    private renderer: WebGLRenderer = undefined
    private camera: Camera = undefined
    private scene: Scene = undefined
}

// ------------------------------------------------------

interface RenderItem {
    uuid: string,
    renderFct: RenderFunction
}