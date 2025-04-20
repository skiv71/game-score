import { randomBytes } from "crypto"

export const generateToken = (bytes: number = 32): string => randomBytes(bytes).toString(`hex`)
