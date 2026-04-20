

import express from "express";
import userRoutes from "./routes/userRoutes.js"
import dotenv from "dotenv"
dotenv.config()
import { connectToDb } from "./config/dbConnect.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}))

await connectToDb()

app.use("/api", userRoutes)



if(process.env.NODE_ENV !== "production") {
    app.listen(3000, () => {
        console.log("Server is running on port 3000")
    })
}


export default app;