const express = require ("./node_modules/express")
const dotenv = require ("./node_modules/dotenv")
const connectDB = require('../config/db')

//lod config
dotenv.config({path: "./config/config.env"})

connectDB()

const app = express();

const PORT = process.env.PORT || 5000

app.listen(PORT , console.log(`server runs in env ${process.env.NODE_ENV} mode with port ${PORT}`))
