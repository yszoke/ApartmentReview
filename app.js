const express = require ("express")
const dotenv = require ("dotenv")
const morgan = require("morgan")
const exphbs = require ("express-handlebars")
const connectDB = require('./config/db')

//lod config
dotenv.config({path: "./config/config.env"})

connectDB()

const app = express();

//Middleware : morgan
if (process.env.NODE_ENV === "development"){
  app.use(morgan('dev'))
}

//Middleware : handlebars - the main pakage for the tamplate randering :(
// Handlebars 
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
  })
)
app.set('view engine', '.hbs')


const PORT = process.env.PORT || 5000

app.listen(PORT , console.log(`server runs in env ${process.env.NODE_ENV} mode with port ${PORT}`))
