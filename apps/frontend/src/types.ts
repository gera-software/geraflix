interface IUser {
    id: string
    name: string
    color: string
}

interface IOccupant extends IUser {
    kind: string
    connectionStatus: boolean
    micStatus: boolean
    camStatus: boolean
}

interface IAttendee extends IOccupant {
    kind: 'attendee'
}

interface IHost extends IOccupant {
    kind: 'host'
    screenShareStatus: boolean
}

interface ISeat {
    id: string,
    occupant?: IOccupant
}

export type {
    IUser,
    IOccupant,
    IHost,
    IAttendee,
    ISeat
}