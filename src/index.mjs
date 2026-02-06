import express, { request, response } from "express"
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"
import session from "express-session"
import { mockUsers } from "./utils/constants.mjs"
import mongoose from "mongoose"


const app = express()

mongoose.connect('mongodb://localhost/express_t')
    .then(()=> console.log('Connected to DB'))
    .catch(err => console.log(err))

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

app.post('/api/auth', (req, res)=>{
    const {body: {username, password}} = req
    const findUser = mockUsers.find(user => user.username === username)

    if (!findUser || findUser.password !== password) 
        return res.status(401).send({msg: 'Bad credentials'})
    
    console.log(req.session);
    
    req.session.user = findUser

    return res.status(200).send(findUser)
})

app.get('/api/auth/status', (req, res)=>{

    req.sessionStore.get(req.sessionID, (err, session)=>{
        console.log(session);  
    })

    return req.session.user ?  
        res.status(200).send(req.session.user) :
        res.status(401).send({msg: 'Not authenticated'})
})

app.post('/api/cart', (req, res)=>{
    if (!req.session.user)
        return res.sendStatus(401)

    const {body: item} = req

    const {cart} = req.session

    if(cart) {
        cart.push(item)
    } else {
        req .session.cart = [item]
    }

    return res.status(201).send(item)
})

app.get('/api/cart', (req, res)=>{
    if (!req.session.user)
        return res.sendStatus(401)

    return res.send(req.session.cart ?? [])
})


app.listen(PORT, ()=>{
    console.log(`running on Port ${PORT}`)
})