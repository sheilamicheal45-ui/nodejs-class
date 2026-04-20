
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export const checkAuth = async (req, res, next) => {
    const token = await req.cookies.token

    if(!token) {
        return res.status(404).json({
            error: true,
            message: "No token found"
        })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decodedToken

        next()
    } catch (err) {
        return res.status(401).json({
            error: true,
            message: "Invalid token"
        })
    }
}