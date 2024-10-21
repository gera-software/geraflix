interface IOccupant {
    id: string
    kind: string
    name: string
    color: string
    connectionStatus: boolean
    micStatus: boolean
    camStatus: boolean
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
    IHost,
    IAttendee,
    IOccupant,
    ISeat
}