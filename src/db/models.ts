interface Model {
    _id: number,
    _created: Date,
    _updated: Date
}

export interface User extends Model {
    email: string
    token: string
}
