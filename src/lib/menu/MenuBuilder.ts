
/**
 * USAGE
 * 
 * @example
 * ```js
const menu = new MenuBuilder('menu)
menu.append(
    `<li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            Files
        </a>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" id="load-faults">Load faults</a></li>
            <li><a class="dropdown-item" href="#">Load grids</a></li>
            <li>
                <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" href="#" id="clear-model">Reset</a></li>
        </ul>
    </li>`)
 *```
*/


export class MenuBuilder {
    private div: HTMLDivElement = undefined
    private ul: HTMLUListElement = undefined

    constructor(parentId: string, id: string = 'navbarSupportedContent') {
        this.div = this.create('div', 'collapse navbar-collapse', id) as HTMLDivElement

        this.ul = this.create('ul', 'navbar-nav me-auto mb-2 mb-lg-0') as HTMLUListElement
        this.div.appendChild(this.ul)

        const parent = document.getElementById(parentId)
        parent.append(this.div)
    }

    append(li: string) {
        this.ul.innerHTML += li
    }

    end() {
        // ?
    }

    private create(type: string, classes: string = undefined, id: string = ''): HTMLElement {
        const d = document.createElement(type)
        classes.split(' ').forEach(c => d.classList.add(c))
        d.id = id
        return d
    }
}