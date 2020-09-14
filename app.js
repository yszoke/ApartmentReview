const path = require ("path")
const express = require ("express")
const mongoose = require ("mongoose")
const dotenv = require ("dotenv")
const morgan = require("morgan")
const passport = require('passport')
const exphbs = require ("express-handlebars")
const sessions = require('express-session')
const mongoStore = require('connect-mongo')(sessions)
const connectDB = require('./config/db')



//lode config
dotenv.config({path: "./config/config.env"})

require('./config/passport')(passport)

connectDB()

const app = express();

//Middleware : morgan
if (process.env.NODE_ENV === "development"){
  app.use(morgan('dev'))
}

// //Middleware : handlebars - the main pakage for the tamplate randering :(
// // Handlebars 
// app.engine(
//   '.hbs',
//   exphbs({
//     defaultLayout: 'main',
//     extname: '.hbs',
//   })
// )
// app.set('view engine', '.hbs')


//@desc Middleware : Sessions (for passport)
app.use(sessions({
  secret: process.env.sessionPaswword,
  resave: false,
  saveUninitialized: false,
  store : new mongoStore({
    mongooseConnection: mongoose.connection
  }),
  expires: new Date(Date.now() + (3 * 60 * 60 * 1000)),// 3 hours session
  maxAge: Date.now() + (3 * 60 * 60 * 1000)// 3 hours session
}))

//@desc Middleware : Passport
app.use(passport.initialize())
app.use(passport.session())

//@desc Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//@desc Middleware : json parser
app.use(express.json())

//@desc Middleware : somthing to do with URLs
app.use(express.urlencoded({extended : false}))

//@desc Routs
app.use('/', require ('./routes/auth'))
app.use('/', require ('./routes/index'))
app.use('/', require ('./routes/APIs'))



const PORT = process.env.PORT || 5000

app.listen(PORT , console.log(`server runs in env ${process.env.NODE_ENV} mode with port ${PORT}`))


