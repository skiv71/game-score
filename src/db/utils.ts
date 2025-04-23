import { ObjectId } from "mongodb"

export function documentId(
    id?: string
): ObjectId | null {
    return id
        ? ObjectId.isValid(id) ? new ObjectId(id) : null
        : new ObjectId()
}
