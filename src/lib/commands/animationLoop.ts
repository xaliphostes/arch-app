export function animate(
    {cb, nb=50, time=300, endCb}:
    {cb: Function, nb?: number, time?: number, endCb?: Function})
{
    return (new AnimationLoop()).start({cb, nb, time, endCb})
}

export class AnimationLoop {
    start(
        {cb, nb=50, time=300, endCb}:
        {cb: Function, nb?: number, time?: number, endCb?: Function})
    {
        this.nb = nb
        this.cb = cb
        this.time = time
        this.intervalId = setInterval(this.loop, this.time/this.nb)
        this.endCb = endCb
        return this
    }

    private loop = () => {
        this.t += 1/(this.nb-1)
        if (this.t <= 1) {
            this.cb(this.t)
        }
        else {	
            clearInterval(this.intervalId)
            if (this.endCb) this.endCb()
        }	
    }

    private t  = 0
    private nb = 100
    private time = 300
    private cb: Function = undefined
    private endCb: Function = undefined
    private intervalId: any = undefined
}
