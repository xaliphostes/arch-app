import { Object3D } from 'three'
import { animate, initGl } from "./gl-helpers/gl"
import { setupMenu } from './menu/setupMenu'
import { fakeRoses } from './fakeRoses'
import { viewToolsMenu } from './menu/viewToolsMenu'

export class App {

    static initialize() {
        Object3D.DEFAULT_UP.set(0, 0, 1) // !!!!!!!!!!! <================ !!!!!!!!!!!

        initGl({
            div: 'c',
            backgroundColor: 0xa5a5a5
        })

        setupMenu()
        viewToolsMenu()

        fakeRoses()
        document.getElementById('main-rose-container').hidden = true

        animate()
    }

}
