import { modalDialog } from "./modalDialog"
import { model } from '../arch/Model'

export function modelInfo() {
    const g = document.getElementById('model-info')
    g.addEventListener('click', e => {
        modalDialog(`<h2>Model info</h2>
        <p>Basic information about the loaded model</p>
        <table class="table" style="width: 400px;">
          <!-- <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Email</th>
            </tr>
          </thead> -->
          <tbody>
            <tr>
              <td>Filename</td>
              <td>${model.filename}</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>${(model.size/1e6).toFixed(2)} Mo</td>
            </tr>
            <tr>
              <td>Last modified</td>
              <td>${model.lastModified}</td>
            </tr>
            <tr>
              <td>Nb faults</td>
              <td>${model.faults.length}</td>
            </tr>
            <tr>
              <td>Nb cavities</td>
              <td>${model.cavities.length}</td>
            </tr>
            <tr>
              <td>Nb grids</td>
              <td>${model.grids.length}</td>
            </tr>
            <tr>
              <td>Nb wells</td>
              <td>${model.wells.length}</td>
            </tr>
            <tr>
              <td>Model is in halfspace</td>
              <td>${model.halfSpace?'yes':'no'}</td>
            </tr>
          </tbody>
        </table>`)
    })
}
