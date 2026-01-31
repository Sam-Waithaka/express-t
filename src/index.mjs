import express, { response } from "express"

const app = express()

const PORT = process.env.PORT || 3000

const mockUsers = [
        {id: 1, username: 'anson', displayName: 'Anson'},
        {id: 2, username: 'anson', displayName: 'Anson'},
        {id: 2, username: 'anson', displayName: 'Anson'},
    ]

app.get('/', (req, res)=>{
    res.status(201).send({msg: 'Hello world'})
})

app.get('/api/users', (req, res)=>{
    res.send(mockUsers)
})

app.get('/api/users/:id', (req, res)=>{
    console.log(req.params);
    const parsedId = parseInt(req.params.id)
    console.log(parsedId);
    
    if (isNaN(parsedId)) return res.status(400).send({message: 'Bad request. Invalid Id'})
    
    const findUser = mockUsers.find(user => user.id === parsedId)

    if (!findUser) return res.status(404).send({message: 'User not found'})
    
    return res.send(findUser)
    
    
})

app.get('/api/products', (req, res)=>{
    res.send([
        {id: 123, name: 'chicken Breast', price: '12.99'}
    ])
})

app.listen(PORT, ()=>{
    console.log(`running on Port ${PORT}`)
})