import express, { request, response } from "express"
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"
import session from "express-session"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser('helloworld'))
app.use(session({
    secret: 'Sam dev',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}))
app.use(routes)


const loggingMiddleware = (req, res, next)=>{
    console.log(`${req.method} - ${req.url}`);
    next()
}

app.use(loggingMiddleware)

app.get('/', loggingMiddleware, (req, res)=>{
    console.log('From base url');
    
    console.log(req.session);
    console.log(req.session.id);    
    
    req.session.visited = true
    
    res.cookie('hello', 'world', {maxAge: 10000, signed: true})
    res.status(201).send({msg: 'Hello world'})
})


app.listen(PORT, ()=>{
    console.log(`running on Port ${PORT}`)
})