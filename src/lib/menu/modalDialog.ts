import { MenuBuilder } from "./MenuBuilder";

export function permanentModalDialog(body: string, builder: MenuBuilder) {
    builder.append(getHtml(body))
}

export function getHtml(body: string) {
    return `
    <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Help
    </button>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Help on the model zip file</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            ${body}
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
        </div>
    </div>
    </div>
    `
}

// -------------------------------------------------------------

export function modalDialog(content: string, style: string='') {
    const div = document.createElement('div')
    div.id = 'modelInfo-div'

    div.innerHTML = `
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                ${content}
            </div>
        </div>`
    document.body.appendChild(div)

    var modal = document.getElementById("myModal")
    modal.style.display = "block" // When the user clicks the button, open the modal 

    // Get the <span> element that closes the modal
    var span = div.getElementsByClassName("close")[0] as HTMLSpanElement


    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none"
        document.body.removeChild(div)
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none"
            document.removeChild(div)
        }
    }
}


// https://stackoverflow.com/questions/3968593/how-can-i-set-multiple-css-styles-in-javascript
// https://stackoverflow.com/questions/37655393/how-to-set-multiple-css-style-properties-in-typescript-for-an-element
// https://stackoverflow.com/a/68461163

