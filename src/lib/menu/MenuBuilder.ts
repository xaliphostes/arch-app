
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

/*
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
    <div class="navbar-nav">
      <a class="nav-item nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
      <a class="nav-item nav-link" href="#">Features</a>
      <a class="nav-item nav-link" href="#">Pricing</a>
      <a class="nav-item nav-link disabled" href="#">Disabled</a>
    </div>
  </div>
</nav>
*/
export class MenuBuilder {
    private div: HTMLDivElement = undefined
    private ul: HTMLUListElement = undefined

    constructor(parentId: string, id: string = 'navbarSupportedContent') {
        this.div = this.create('div', 'navbar navbar-expand-lg navbar-light bg-light', id) as HTMLDivElement
        this.div.innerHTML = `
            <a class="navbar-brand" href="#">Arch-app</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav" id="navbarNavAltMarkupUl"></ul>
            </div>`
        const parent = document.getElementById(parentId)
        parent.append(this.div)

        // this.ul = this.create('ul', 'navbar-nav me-auto mb-2 mb-lg-0') as HTMLUListElement
        // this.div.appendChild(this.ul)
        this.ul = document.getElementById('navbarNavAltMarkupUl') as HTMLUListElement
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