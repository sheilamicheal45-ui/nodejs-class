

import { userValidation, loginValidation } from "../validator/userInputValidator.js";
import { db } from "../config/dbConnect.js";
import bcrypt from "bcryptjs";
import { userShape } from "../models/userSchema.js";
import { genToken } from "../utils/generateToken.js";


export const getHome = (req, res) => {
   res.send("This is the homepage!")
}

export const postUser = async (req, res) => {
    const {username, email, password} = req.body
    try {
        const {error} = userValidation.validate(req.body)
        
        if(error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message
            })
        }

        const existingUser = await db().collection("users").where("email", "==", email).get()

        if(!existingUser.empty) {
            return res.status(400).json({
                error: true,
                message: "User already exists, login instead"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await db().collection("users").add(userShape({
            username,
            email,
            password: hashedPassword
        }))

        const token = await genToken({
            id: newUser.docs[0].id
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        return res.status(201).json({
            error: false,
            message: "User created successfully",
            data: newUser
        })
        
    } catch (err) {
        console.error(err)
        throw new Error("Failed to create user", err)
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        const {error} = loginValidation.validate(req.body)

        if(error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message
            })
        }

        const existingUser = await db().collection("users").where("email", "==", email).get()

        if(existingUser.empty) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            })
        }

        const userDetails = await existingUser.docs[0].data()

        const isPasswordValid = await bcrypt.compare(password, userDetails.password)

        if(!isPasswordValid) {
            return res.status(401).json({
                error: true,
                message: "Invalid credentials"
            })
        }

        const token = await genToken({
            id: existingUser.docs[0].id
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            error: false,
            message: "User logged in successfully",
            data: {
                username: userDetails.username,
                email: userDetails.email
            }
        })
    } catch (err) {
        console.error(err)
        throw new Error("Failed to login user", err)
    }
}


export const getProfile = async (req, res) => {
    const {id} = req.user
    try {
        const userProfile = await db().collection("users").doc(id).get()

        if(userProfile.empty) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            })
        }

        const userDetails = await userProfile.data()

        return res.status(200).json({
            error: false,
            data: {
                username: userDetails.username,
                email: userDetails.email
            }
        })
    } catch (err) {
        console.error(err)
        throw new Error("Failed to get user profile", err)
    }
}


export const singleUser = async (req, res) => {
   const {id} = req.params

   try {
    
const userDetails = await db().collection("users").doc(id).get()

if(userDetails.empty) {
    return res.status(404).json({
        error: true,
        message: "User does not exist"
    })
}

const user = await userDetails.data()

return res.status(200).json({
    error: false,
    data: user
})
    
   } catch (err) {
    console.error(err)
    throw new Error("Failed to get user profile", err)
   }
}