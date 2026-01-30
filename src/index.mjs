import express from "express"

const app = express()

const PORT = process.env.PORT || 3000

app.get('/', (req, res)=>{
    res.status(201).send({msg: 'Hello world'})
})

app.get('/api/users', (req, res)=>{
    res.send([
        {id: 1, username: 'anson', displayName: 'Anson'},
        {id: 2, username: 'anson', displayName: 'Anson'},
        {id: 2, username: 'anson', displayName: 'Anson'},
    ])
})

app.get('/api/products', (req, res)=>{
    res.send([
        {id: 123, name: 'chicken Breast', price: '12.99'}
    ])
})

app.listen(PORT, ()=>{
    console.log(`running on Port ${PORT}`)
})