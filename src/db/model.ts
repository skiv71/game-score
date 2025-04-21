import { ObjectId } from "mongodb"

export interface IModel {
    readonly _id?: ObjectId
    readonly _created?: Date
    readonly _updated?: Date
}

export class Model<T> {

    readonly _id: ObjectId
    readonly _created: Date
    readonly _updated: Date
   
    constructor(
        o: T & IModel
    ) {
        const d = new Date
        this._id = o._id || new ObjectId()
        this._created = o._created || d
        this._updated = d
    }

}
