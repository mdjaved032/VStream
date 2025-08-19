import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

// Enable Cross-Origin Resource Sharing (CORS) for allowed origin
// - origin: only allow requests from the domain in CORS_ORIGIN env variable
// - credentials: allow cookies/auth headers to be sent in cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

// Parse incoming JSON payloads (max size: 16kb)
app.use(express.json({limit: "16kb"}))

// Parse URL-encoded form data (max size: 16kb)
// extended: true => supports nested objects
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// Serve static files from 'public' directory
app.use(express.static("public"))

// Parse cookies from incoming requests (makes them available in req.cookies)
app.use(cookieParser())


// import routes
import userRouter from "./routes/user.route.js";

app.use("/api/v1/user", userRouter)

export { app }