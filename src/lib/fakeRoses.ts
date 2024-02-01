import { RoseDiagram } from 'rose-diagram'

export function fakeRoses() {
    const parent = document.getElementById('rose-container') as HTMLDivElement

    let id = 0
    id = appendRoses(parent, id)
    id = appendRoses(parent, id)
    id = appendRoses(parent, id)
}

function appendRoses(parent: HTMLDivElement, id: number): number {
    appendRose(parent, id)
    appendRose(parent, id + 1)
    return id + 2
}

function appendRose(parent: HTMLDivElement, id: number) {
    const e = document.createElement('div')
    e.classList.add('col-sm-6')
    e.id = `rose-${id}`
    parent.appendChild(e)

    const rose = new RoseDiagram(`rose-${id}`, new Array(100).fill(0).map(_ => Math.random() * 360), {
        width: 150,
        height: 150,
        margin: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        },
        draw: {
            cardinals: false
        }
    })
    // rose.width = 150
    // rose.height = 150
    // rose.cardinals = false
    if (id % 2 === 0) {
        rose.fillColor = '#0000ff'
    }

    rose.update()
}
