import { randomBytes } from "crypto"

export const generateToken = (bytes: number = 64): string => randomBytes(bytes).toString(`hex`)
