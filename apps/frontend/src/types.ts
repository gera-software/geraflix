interface IUser {
    id: string
    name: string
    color: string
}

interface IOccupant extends IUser {
    kind: string
    connectionStatus?: boolean
    micStatus?: boolean
    camStatus?: boolean

    roomId: string
    socketId: string
    peerId: string
}

interface IAttendee extends IOccupant {
    kind: 'attendee'
}

interface IHost extends IOccupant {
    kind: 'host'
    screenShareStatus?: boolean
}

interface ISeat {
    id: string,
    occupant?: IOccupant
}

export function isHost(occupant: IOccupant): occupant is IHost {
    return (<IHost>occupant).kind == 'host';
 }

export type {
    IUser,
    IOccupant,
    IHost,
    IAttendee,
    ISeat,
}