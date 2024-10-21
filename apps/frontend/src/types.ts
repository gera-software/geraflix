interface IUser {
    id: string
    name: string
    color: string
}

interface ISeat {
    id: string,
    user?: IUser
}

export type {
    IUser,
    ISeat
}