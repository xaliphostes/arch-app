import { Object3D } from 'three'
import { animate, initGl } from "./gl-helpers/gl"
import { setupMenu } from './menu/setupMenu'

export class App {

    static initialize() {
        Object3D.DEFAULT_UP.set(0, 0, 1) // !!!!!!!!!!! <================ !!!!!!!!!!!

        setupMenu()

        initGl({
            div: 'c',
            backgroundColor: 0xa5a5a5
        })

        animate()
    }

}
