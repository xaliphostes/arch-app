import { Mesh } from 'three'

export enum BC {
    TRACTION = 0,
    DISPLACEMENT = 1,
    UNDEFINED = 2
}

export function getBcName(bc: BC) {
    if (bc === BC.TRACTION) {
        return 'free'
    }
    if (bc === BC.DISPLACEMENT) {
        return 'fixed'
    }
    return 'undefined'
}

export function fromNameToBc(name: string): BC {
    const t = ['t', 'traction', 'tract', 'free', '0']
    const b = ['b', 'displacement', 'displ', 'fixed', '1']
    if (t.includes(name)) {
        return BC.TRACTION
    }
    if (b.includes(name)) {
        return BC.DISPLACEMENT
    }
    return BC.UNDEFINED
}

export function addSetupTo(mesh: Mesh, isCavity = false) {
    mesh.userData.setup = {
        active: true,
        bcx: 0,
        bcy: 0,
        bcz: isCavity ? 0 : 1,
    }
}
