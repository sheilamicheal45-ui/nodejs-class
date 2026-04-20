import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config()


export const genToken = async (payload) => {
   const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d"
   })

   return token;
}