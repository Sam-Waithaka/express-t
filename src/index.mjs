import express, { request, response } from "express"
import routes from "./routes/index.mjs"
import cookieParser from "cookie-parser"
import session from "express-session"
import { mockUsers } from "./utils/constants.mjs"
import passport from "passport"
import './strategies/local-strategy.mjs'


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
app.use(passport.initialize())
app.use(passport.session())
app.use(routes)


const loggingMiddleware = (req, res, next)=>{
    console.log(`${req.method} - ${req.url}`);
    next()
}

app.use(loggingMiddleware)

app.post('/api/auth', passport.authenticate('local'), (req, res)=>{
    return res.sendStatus(200)
})

app.get('/api/auth/status', (req, res)=>{
    console.log("Inside '/api/auth/status'");
    console.log(req.user);
    console.log(req.session);
    
    
    if (req.user)
        return res.send(req.user)

    return res.sendStatus(401)
})

app.post('/api/auth/logout', (req, res)=>{
    if (!req.user)
        return res.sendStatus(401)

    req.logout((err)=>{
        if (err)
            return res.sendStatus(400)

        res.send(200)
    })
})

app.get('/', loggingMiddleware, (req, res)=>{
    console.log('From base url');
    
    console.log(req.session);
    console.log(req.session.id);    
    
    req.session.visited = true
    
    res.cookie('hello', 'world', {maxAge: 10000, signed: true})
    res.status(201).send({msg: 'Hello world'})
})

// app.post('/api/auth', (req, res)=>{
//     const {body: {username, password}} = req
//     const findUser = mockUsers.find(user => user.username === username)

//     if (!findUser || findUser.password !== password) 
//         return res.status(401).send({msg: 'Bad credentials'})
    
//     console.log(req.session);
    
//     req.session.user = findUser

//     return res.status(200).send(findUser)
// })


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