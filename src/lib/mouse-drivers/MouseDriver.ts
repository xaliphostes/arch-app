export abstract class MouseDriver {
    constructor(private elt: HTMLElement) {
    }

    install() {
        this.elt.addEventListener('mousedown', this.onMouseDown)
        this.elt.addEventListener('mouseup', this.onMouseUp)
        this.elt.addEventListener('mousemove', this.onMouseMove)
        this.elt.addEventListener('keydown', this.onKeyDown)
        this.elt.addEventListener('keyup', this.onKeyUp)
    }

    deinstall() {
        this.elt.removeEventListener('mousedown', this.onMouseDown)
        this.elt.removeEventListener('mouseup', this.onMouseUp)
        this.elt.removeEventListener('mousemove', this.onMouseMove)
        this.elt.removeEventListener('keydown', this.onKeyDown)
        this.elt.removeEventListener('keyup', this.onKeyUp)
    }

    abstract onMouseDown(e: MouseEvent): void
    abstract onMouseUp(e: MouseEvent)
    abstract onMouseMove(e: MouseEvent)

    abstract onKeyDown(e: KeyboardEvent): void
    abstract onKeyUp(e: KeyboardEvent): void
}
