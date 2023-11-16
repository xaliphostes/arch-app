/**
 * @brief Represents a connection between a sender and a receiver
 * @example
 * ```ts
 * import {connect, disconnect, emit} from 'signal-slot'
 * 
 * const connection = { sender: obj1, signal: 'finished', receiver: () => log('done') }
 * connect(connection)
 * 
 * connect({
 *      sender  : obj1,
 *      signal  : 'finished',
 *      receiver: obj2,
 *      slot    : 'run'
 * })
 * 
 * emit(obj1, 'finished') // will print 'done'
 * 
 * disconnect(connection)
 * emit(obj1, 'finished') // will NOT print 'done'
 * ```
 */
export type Connection = {
    sender: any,
    signal: string,
    receiver: any,
    slot?: string
}

/**
 * Dump all the signals and the associated [[Connection]]s attached to the object
 * @param sender
 *
 */
export function dump(sender: any) {
    if (!sender._mapSignals) {
        console.warn(`Emitter is not configured to support any signal. Consider creating a signal first.`)
        return
    }
    console.log('----------------------------------------')
    console.log('Dumping Signal/slot for object', sender.constructor.name)
    sender._mapSignals.forEach( (signal: any, name: string) => {
        console.log(`  - signal '${name}'`)
        signal.forEach( (connection: any) => {
            if (connection.slot === undefined) {
                console.log(`    - slot ${connection.receiver.constructor.name}`)
            }
            else {
                console.log(`    - slot ${connection.receiver.constructor.name}.${connection.slot}`)
            }
            
        })
    })
    console.log('----------------------------------------')
}

/**
 * Create a new signal
 * @param {Object}  sender The sender which will hold the signal
 * @param {string}  signal The name of the signal
 * @returns {boolean} True if success
 */
export function create(sender: any, signal: string): boolean {
    if (sender._mapSignals === undefined) {
        sender._mapSignals = new Map()
    }

    if (sender._mapSignals.has(signal)) {
        console.warn(`Signal named ${signal} already defined.`)
        return false
    }

    sender._mapSignals.set(signal, [])
    return true
}

/** @internal */
class InnerConnection {
    public locked  : boolean = false

    constructor(public sender: any, public receiver: any, public slot?: string, public desc?: any) {
    }
}

/**
 * Connect a sender to a receiver using either the signal/slot or the signal/function by mean
 * of a [[Connection]]
 * @param {Connection} c The connection
 * @returns {boolean} True if sucess
 */
export function connect(c: Connection): boolean {
    if (!c.sender._mapSignals) {
        console.warn(`Emitter is not configured to support any signal. Consider creating a signal first.`)
        return false
    }
    if (!c.sender._mapSignals.has(c.signal)) {
        console.warn(`Emitter does not have a signal named "${c.signal}"`)
        return false
    }
    if (typeof c.receiver === 'function') {
        c.sender._mapSignals.get(c.signal).push(new InnerConnection(c.sender, c.receiver))
        return true
    }

    if (c.slot === undefined) {
        console.warn('Require to define the slot')
        return false
    }

    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(c.receiver), c.slot)
    if (desc) {
        if (!desc.get && !desc.value) {
            console.warn(`Receiver does not have a slot named "${c.slot}"`)
            return false
        }
        c.sender._mapSignals.get(c.signal).push(new InnerConnection(c.sender, c.receiver, c.slot, desc))
    } else {
        if (c.receiver[c.slot]) {
            c.sender._mapSignals.get(c.signal).push(new InnerConnection(c.sender, c.receiver, c.slot, c.slot))
        } else {
            console.warn(`Receiver does not have a slot named "${c.slot}"`)
            return false
        }
    }
    return true
}

/** @internal */
function getConnection(c: Connection): any {
    function _get(signals: Array<any>, receiver: any, slot?: string) {
        for (let i=0; i<signals.length; ++i) {
            const s = signals[i]
            if (s.receiver === receiver && s.slot === slot) {
                return s
            }
        }
        return undefined
    }

    if (!c.sender._mapSignals) return undefined
    if (!c.sender._mapSignals.has(c.signal)) return undefined

    const signals = c.sender._mapSignals.get(c.signal)

    if (typeof c.receiver === 'function') {
        return _get(signals, c.receiver, c.slot)
    }

    if (c.slot === undefined) {
        return undefined
    }

    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(c.receiver), c.slot)
    if (desc) {
        if (!desc.get && !desc.value) return undefined
        return _get(signals, c.receiver, c.slot)
    } else {
        if (c.receiver[c.slot]) {
            return _get(signals, c.receiver, c.slot)
        }
        return undefined
    }
}

/**
 * Lock a specific [[Connection]] from being called
 * @param {Connection} c The connection
 * @see Connection
 */
export function lock(c: Connection): boolean {
    const conn = getConnection(c)
    if (conn === undefined) return false
    conn.locked = true
    return true
}

/**
 * Unlock a specific [[Connection]] so that it can be called again
 * @param {Connection} c The connection
 * @see Connection
 */
export function unlock(c: Connection): boolean {
    const conn = getConnection(c)
    if (conn === undefined) return false
    conn.locked = false
    return true
}

/**
 * Check if a [[Connection]] is locked or not
 * @param {Connection} c The connection
 * @see Connection
 */
export function isLocked(c: Connection): boolean {
    const conn = getConnection(c)
    if (conn === undefined) return false
    return conn.locked
}

/**
 * Disconnect an existing [[Connection]]
 * @param c The connection
 */
export function disconnect(c: Connection): boolean {
    function removeFromArray(signals: Array<any>, receiver: any, slot?: string) {
        for (let i=0; i<signals.length; ++i) {
            const s = signals[i]
            if (s.receiver === receiver && s.slot === slot) {
                signals.splice(i, 1)
                return true
            }
        }
        return false
    }

    if (!c.sender._mapSignals) {
        return false
    }
    if (!c.sender._mapSignals.has(c.signal)) {
        return false
    }

    const signals = c.sender._mapSignals.get(c.signal)

    if (typeof c.receiver === 'function') {
        return removeFromArray(signals, c.receiver)
    }

    if (c.slot === undefined) {
        return false
    }

    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(c.receiver), c.slot)
    if (desc) {
        if (!desc.get && !desc.value) {
            return false
        }
        return removeFromArray(signals, c.receiver, c.slot)
    } else {
        if (c.receiver[c.slot]) {
            return removeFromArray(signals, c.receiver, c.slot)
        } else {
            return false
        }
    }
}

/**
 * Diconnect all [[Connection]]s from the sender
 * @param sender 
 * @param signal 
 */
export function disconnectAll(sender: any, signal: string) {
    if (!sender._mapSignals) {
        return false
    }
    if (!sender._mapSignals.has(signal)) {
        return false
    }

    const signals = sender._mapSignals.get(signal)
    signals.splice(0, signals.length)
    return true
}

/**
 * Emit a signal with arguments or not
 * @param sender The object that will emit the signal
 * @param signal The signal name
 * @param args optional argument(s)
 * @example
 * ```ts
 * import {create, connect, emit} from '../src'
 * 
 * class T {
 *      constructor(private name: string) {
 *          create(this, 'finished')
 *          connect({sender: this, signal: 'finished', receiver: this, slot: 'done'})
 *      }
 *      start() {
 *          console.log(this.name, 'is starting')
 *          setTimeout( () => emit(this, 'finished'), 500) // <-----
 *      }
 *      done()  {
 *          console.log(this.name, 'is done')
 *      }
 * }
 * 
 * const a = new T('A')
 * const b = new T('B')
 * connect({sender: a, signal: 'finished', receiver: b, slot: 'start'})
 * a.start()
 * ```
 * will display
 * ```console
 * A is starting
 * A is done
 * B is starting
 * B is done
 * ```
 */
export function emit(sender: any, signal: string, ...args: any): boolean {
    if (!sender._mapSignals) {
        console.warn('Source does not support Signal/Slot.')
        return false
    }
    
    if (sender._mapSignals.has(signal)) {
        _trigger(sender, signal, args)
    } else {
        console.warn(`Source does not have the signal named ${signal}.`)
        return false
    }

    return true
}

/** @internal */
function _trigger(sender: any, signal: string, args: Array<{receiver: any, desc: any, locked: boolean}>) {
    sender._mapSignals.get(signal).forEach( (pair: {receiver: any, desc: any, locked: boolean}) => {
        if (pair.locked===true) return
        if (pair.desc===undefined) {
            pair.receiver(...args) // function
        } else {
            if (pair.desc.value ) {
                pair.desc.value.call(pair.receiver, ...args) // method
                
            } else if (pair.desc.set) {
                pair.desc.set.call(pair.receiver, ...args)  // setter
            } else {
                pair.receiver[pair.desc].call(pair.receiver, ...args) // arrow method
            }
        }
    })
}