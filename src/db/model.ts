import {
    CreateIndexesOptions,
    ObjectId
} from "mongodb"

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

type ModelIndexFilter<T> = Partial<{
    [K in keyof T]: T[K]
}>

type IndexKeyValue = -1 | 0 | 1

type ModelIndexKeys<T> = Partial<Record<keyof T, IndexKeyValue>>

type ModelIndexOptions<T> = CreateIndexesOptions & {
    partialFilterExpression?: ModelIndexFilter<T>
}

export type ModelIndex<T> = {
    keys: ModelIndexKeys<T>,
    options: ModelIndexOptions<T>
}
