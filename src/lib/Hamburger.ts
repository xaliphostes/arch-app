import $ from "jquery"

export class Hamburger {
    private trigger: JQuery<HTMLElement> = undefined
    private overlay: JQuery<HTMLElement> = undefined
    private isClosed = false

    constructor(ham = '.hamburger', over = '.overlay', open = false) {
        this.trigger = $(ham)
        this.overlay = $(over)
        this.isClosed = false
        this.trigger.click(_ => this.hamburger_cross())
        $('[data-toggle="offcanvas"]').click(() => $('#wrapper').toggleClass('toggled'))
        if (open) {
            this.trigger.click()
        }
    }

    hamburger_cross = () => {
        if (this.isClosed === true) {
            this.open()
        } else {
            this.close()
        }
    }

    open = () => {
        this.overlay.hide()
        this.trigger.removeClass('is-open')
        this.trigger.addClass('is-closed')
        this.isClosed = false
    }

    close = () => {
        this.overlay.show()
        this.trigger.removeClass('is-closed')
        this.trigger.addClass('is-open')
        this.isClosed = true
    }
}