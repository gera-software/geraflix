interface IUser {
    id: string
    name: string
    color: string
}

interface IOccupant {
    kind: string
    connectionStatus: boolean
    micStatus: boolean
    camStatus: boolean
    user: IUser
}

interface IHost extends IOccupant {
    kind: 'host'
    screenShareStatus: boolean
}

interface IAttendee extends IOccupant {
    kind: 'attendee'
}


interface ISeat {
    id: string,
    occupant?: IOccupant
}

export type {
    IUser,
    IHost,
    IAttendee,
    IOccupant,
    ISeat
}