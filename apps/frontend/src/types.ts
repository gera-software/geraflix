interface IUser {
    id: string
    name: string
    color: string
}

interface IAttendee extends IUser {
    connectionStatus: boolean
    micStatus: boolean
    camStatus: boolean
}

interface IHost extends IAttendee {
    isHost: boolean
    screenShareStatus: boolean
}

interface ISeat {
    id: string,
    occupant?: IAttendee
}

export type {
    IHost,
    IAttendee,
    ISeat
}