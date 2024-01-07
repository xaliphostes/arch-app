import { 
    Box3, Object3D, Vector3, Group, Sphere, DirectionalLight, HemisphereLight,
    Mesh, SphereGeometry, MeshBasicMaterial, DirectionalLightHelper, SpotLight
} from 'three'

import { createGrayColor } from '../gl-helpers/utils'
import { glParameters } from "../gl-helpers/gl"

export function createDefaultLights2(object: Object3D): void {
    if (glParameters.lights === undefined) {
        glParameters.lights = new Group()
        glParameters.lights.userData.isPickable = false
        glParameters.lights.name = 'lights'
        glParameters.scene.add(glParameters.lights)
    } else {
        glParameters.lights.remove(...glParameters.lights.children)
    }

    let radius = 1
    let center = new Vector3(0, 0, 0)

    if (object !== undefined) {
        const b = new Box3
        b.setFromObject(object)

        const sphere = new Sphere
        b.getBoundingSphere(sphere)

        radius = sphere.radius
        center = sphere.center
    }

    const dir = center.clone()
    dir.add(new Vector3(radius, radius, radius))


    let dirLight = new DirectionalLight(0xaaaaaa)
    dirLight.name = 'light-1'
    // dirLight.position.set(dir.x, dir.y, dir.z)
    dirLight.position.set(0,0, dir.z+dir.z*3)
    dirLight.castShadow = glParameters.parameters.shadows
    dirLight.shadow.radius = radius
    dirLight.shadow.bias = - 0.0005
    // dirLight.shadow.camera.near = 0.1;
    // dirLight.shadow.camera.far = 500;
    // dirLight.shadow.camera.right = 17;
    // dirLight.shadow.camera.left = - 17;
    // dirLight.shadow.camera.top = 17;
    // dirLight.shadow.camera.bottom = - 17;
    // dirLight.shadow.mapSize.width = 512;
    // dirLight.shadow.mapSize.height = 512;

    glParameters.lights.add(dirLight)

    dirLight = new DirectionalLight(0xaaaaaa)
    dirLight.name = 'light-2'
    // dirLight.position.set(dir.x, dir.y, -dir.
    dirLight.position.set(0,0, -dir.z+dir.z*2)
    dirLight.castShadow = glParameters.parameters.shadows
    dirLight.shadow.radius = radius
    dirLight.shadow.bias = - 0.0005
    glParameters.lights.add(dirLight)


    const light = new SpotLight( 0xffffff );
    light.name = 'spotlight-1'
    light.castShadow = true; // default false
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    light.shadow.focus = 1; // default
    glParameters.lights.add( light );

    // ---------------------------------------------

    const intensitySky = 0.4 // param for flux
    const intensityground = 0.4 // param for flux
    const sky = 0xffffff

    const ground = createGrayColor(intensityground)

    const h1 = new HemisphereLight(sky, ground, intensitySky)
    h1.position.set(0, 10, 10)
    glParameters.lights.add(h1)

    const h2 = new HemisphereLight(sky, ground, intensitySky)
    h2.position.set(0, -10, -10)
    glParameters.lights.add(h2)
}

function showLight(radius: number, dir: Vector3, light: DirectionalLight) {
    let size = radius / 10
    const sphere = new Mesh(new SphereGeometry(size, 32, 32), new MeshBasicMaterial({ color: 0xff0000 }));
    sphere.position.set(dir.x, dir.y, dir.z)
    glParameters.lights.add(sphere)

    // const helper = new DirectionalLightHelper(light, 5);
    // glParameters.lights.add( helper );
}
