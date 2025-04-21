import {
    IModel,
    Model
} from "../model"

interface IUser extends IModel {
    email: string
}

export default class User extends Model<IUser> {

    public email: string

    constructor(
        user: IUser
    ) {
        super(user)
        this.email = user.email
    }

}
