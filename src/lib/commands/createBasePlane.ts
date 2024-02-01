import { glParameters } from "../gl-helpers/gl"
import {
    Mesh, Box3, PlaneGeometry, ShadowMaterial, Object3D, Vector3,
    Group, Sphere, GridHelper
} from 'three'

export function createBasePlane(object: Object3D): void {
    let radius = 1
    let center = new Vector3(0, 0, 0)

    if (glParameters.baseGrid !== undefined) {
    }

    if (glParameters.baseGrid === undefined) {
        glParameters.baseGrid = new Group()
        glParameters.baseGrid.userData.isPickable = false
        glParameters.baseGrid.name = 'grid'
        glParameters.scene.add(glParameters.baseGrid)
    }
    else {
        glParameters.baseGrid.remove(...glParameters.baseGrid.children)
    }

    if (object !== undefined) {
        const b = new Box3()
        b.setFromObject(object)

        const sphere = new Sphere()
        b.getBoundingSphere(sphere)

        radius = sphere.radius
        center = sphere.center
    }

    const R = radius * 5
    const scaling = 0.6

    // ------------------------------------------------

    const planeGeometry = new PlaneGeometry(R, R)
    const planeMaterial = new ShadowMaterial({ color: 0x000000, opacity: 0.1 })

    const plane = new Mesh(planeGeometry, planeMaterial)
    plane.rotation.set(Math.PI / 2, Math.PI / 2, 0)
    plane.position.x = center.x
    plane.position.y = center.y
    plane.position.z = center.z - radius * scaling
    plane.receiveShadow = glParameters.parameters.shadows
    plane.userData.isPickable = false
    plane.name = 'grid-plane'

    const helper = new GridHelper(R, 50)
    helper.rotation.set(Math.PI / 2, Math.PI / 2, 0)
    helper.position.x = center.x
    helper.position.y = center.y
    helper.position.z = center.z - radius * scaling * 0.99
    helper.material.opacity = 0.2
    helper.material.transparent = false
    helper.userData.isPickable = false
    helper.name = 'grid-helper'

    glParameters.baseGrid.add(plane)
    glParameters.baseGrid.add(helper)
}
