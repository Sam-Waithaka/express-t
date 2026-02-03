import express, { request, response } from "express"

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())

const mockUsers = [
    { id: 1, username: 'anson', displayName: 'Anson' },
    { id: 2, username: 'bella', displayName: 'Bella' },
    { id: 3, username: 'charles', displayName: 'Charles' },
    { id: 4, username: 'diana', displayName: 'Diana' },
    { id: 5, username: 'edwin', displayName: 'Edwin' },
    { id: 6, username: 'faith', displayName: 'Faith' },
    { id: 7, username: 'george', displayName: 'George' },
    { id: 8, username: 'hannah', displayName: 'Hannah' },
    { id: 9, username: 'ian', displayName: 'Ian' },
    { id: 10, username: 'jane', displayName: 'Jane' }
]

app.get('/', (req, res)=>{
    res.status(201).send({msg: 'Hello world'})
})

app.get('/api/users', (req, res) => {
    const { filter, value } = req.query

    if (filter && value) {
        return res.send(mockUsers.filter(user => user[filter].includes(value)))
    }

    return res.send(filteredUsers)
})

app.post('/api/users', (req, res)=>{
    const {body} = req
    const newUser = {id: mockUsers.length + 1, ...body}
    mockUsers.push(newUser)
    return res.status(201).send(mockUsers)
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