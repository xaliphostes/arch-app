import {
    Mesh, Box3,
    Object3D, Vector3, DirectionalLightHelper,
    Group, Sphere, DirectionalLight, SphereGeometry,
    MeshBasicMaterial, HemisphereLight
} from 'three'
import { createGrayColor } from '../gl-helpers/utils'
import { glParameters } from '../gl-helpers/gl'

export function createDefaultLights(object: Object3D): void {
    let radius = 1
    let center = new Vector3(0, 0, 0)

    if (glParameters.lights === undefined) {
        glParameters.lights = new Group()
        glParameters.lights.userData.isPickable = false
        glParameters.lights.name = 'lights'
        glParameters.scene.add(glParameters.lights)
    } else {
        glParameters.lights.remove(...glParameters.lights.children)
    }

    if (object !== undefined) {
        const b = new Box3
        b.setFromObject(object)

        const sphere = new Sphere
        b.getBoundingSphere(sphere)

        radius = sphere.radius
        center = sphere.center
    }

    // let dir = new Vector3(radius,4*radius,3*radius)
    // //let dir = new Vector3(5,20,12)
    const dir = center.clone()
    dir.add(new Vector3(radius, radius, radius * 2))

    const dirLight = new DirectionalLight(0xaaaaaa)
    // dirLight = new SpotLight(0xaaaaaa)

    if (object) {
        dirLight.target = object
    }
    dirLight.position.set(dir.x, dir.y, dir.z)
    dirLight.castShadow = true
    glParameters.lights.add(dirLight)

    // dirLight.shadow.camera.near = 0.01
    // dirLight.shadow.camera.far = 100000
    // dirLight.shadow.mapSize.x = 512
    // dirLight.shadow.mapSize.y = 512
    // const size = 100
    // dirLight.shadow.camera.left = -size;
    // dirLight.shadow.camera.bottom = -size;
    // dirLight.shadow.camera.right = size;
    // dirLight.shadow.camera.top = size;

    // DEBUG
    if (0) {
        let size = radius / 10;
        const sphere = new Mesh(new SphereGeometry(size, 32, 32), new MeshBasicMaterial({ color: 0xff0000 }));
        sphere.position.set(dir.x, dir.y, dir.z)
        glParameters.lights.add(sphere)
        const helper = new DirectionalLightHelper(dirLight, 5);
        // glParameters.scene.add( helper );
    }
    //

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
