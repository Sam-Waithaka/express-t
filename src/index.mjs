import express, { request, response } from "express"
import routes from "./routes/index.mjs"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(routes)



const loggingMiddleware = (req, res, next)=>{
    console.log(`${req.method} - ${req.url}`);
    next()
}

app.use(loggingMiddleware)

app.get('/', loggingMiddleware, (req, res)=>{
    res.status(201).send({msg: 'Hello world'})
})


app.listen(PORT, ()=>{
    console.log(`running on Port ${PORT}`)
})