import { TextureLoader, Texture } from 'three'

export type Index = {
    color: string,
    pos: number
}

export class Background {
    private indices_: Index[] = []

    constructor({ start = { color: '#222222', pos: 1 }, stop = { color: '#000000', pos: 0 } }: { start?: Index, stop?: Index } = {}) {
        if (start) {
            this.indices_.push(start)
        }
        if (stop) {
            this.indices_.push(stop)
        }
    }

    addIndex(i: Index) {
        this.indices_.push(i)
    }

    get start() {
        this.sort()
        return this.indices_[0]
    }

    get stop() {
        this.sort()
        return this.indices_[this.indices_.length - 1]
    }

    generate(): Texture {
        this.sort()

        let textureLoader = new TextureLoader()
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')

        let size = 256
        canvas.width = size
        canvas.height = size

        let bg = ctx.createLinearGradient(0, 0, 0, size)
        this.indices_.forEach(i => bg.addColorStop(i.pos, i.color))

        ctx.fillStyle = bg
        ctx.fillRect(0, 0, size, size)

        return textureLoader.load(canvas.toDataURL())
    }

    private sort() {
        this.indices_.sort((a: Index, b: Index) => a.pos < b.pos ? -1 : a.pos > b.pos ? 1 : 0)
    }
}

export const gradedBackground = new Background()
