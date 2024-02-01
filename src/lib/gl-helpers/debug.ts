import { Mesh, MeshPhongMaterial, BoxGeometry, SphereGeometry } from 'three'
import { fitScene } from '../commands/fitScene';
import { createBasePlane } from '../commands/createBasePlane';
import { glParameters } from './gl';
import { createDefaultLights } from '../commands/createDefaultLights';

// import { addMesh } from './gl'

export function populateGlDebug() {
    {
        const geometry = new SphereGeometry()
        const material = new MeshPhongMaterial({
            color: 0xff0000,
            flatShading: false,
            vertexColors: false,
            shininess: 0,
            wireframe: false
        });
        const mesh = new Mesh(geometry, material)
        mesh.translateX(-1)
        mesh.name = 'Sphere'
        glParameters.faults.add(mesh)
        // addMesh({ mesh, group: glParameters.group })
    }
    {
        const geometry = new BoxGeometry()
        const material = new MeshPhongMaterial({
            color: 0x0000ff,
            flatShading: false,
            vertexColors: false,
            shininess: 0
        });
        const mesh = new Mesh(geometry, material)
        mesh.translateX(1)
        mesh.name = 'Box'
        glParameters.faults.add(mesh)
        // addMesh({ mesh, group: glParameters.group })
    }

    createDefaultLights(glParameters.scene)
    createBasePlane(glParameters.scene)

    fitScene({
        scene: glParameters.scene, 
        camera: glParameters.camera, 
        controls: glParameters.controls,
        selection: glParameters.scene
    })
}
