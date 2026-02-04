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

const loggingMiddleware = (req, res, next)=>{
    console.log(`${req.method} - ${req.url}`);
    next()
}

app.use(loggingMiddleware)

const resolveIndexByUserId = (req, res, next)=>{
    const { params: {id}} = req

    const parsedId = parseInt(id)

    if (isNaN(parsedId)) return res.sendStatus(400)

    const findUserIndex = mockUsers.findIndex((user)=>user.id === parsedId)
    
    if (findUserIndex === -1) return res.sendStatus(404)
    req.findUserIndex = findUserIndex
    next()
}

app.get('/', loggingMiddleware, (req, res)=>{
    res.status(201).send({msg: 'Hello world'})
})

app.get('/api/users', (req, res) => {
    const { filter, value } = req.query

    if (filter && value) {
        return res.send(
            mockUsers.filter(user =>
                typeof user[filter] === 'string' &&
                user[filter].includes(value)
            )
        )
    }

    return res.json(mockUsers)
})


app.post('/api/users', (req, res)=>{
    const {body} = req
    const newUser = {id: mockUsers.length + 1, ...body}
    mockUsers.push(newUser)
    return res.status(201).send(mockUsers)
})


app.get('/api/users/:id', resolveIndexByUserId, (req, res)=>{
    const {findUserIndex} = req
    if (!findUser) return res.status(404).send({message: 'User not found'})
    return res.send(findUser)   
})

app.put('/api/users/:id', resolveIndexByUserId, (req, res)=>{

    const {body, findUserIndex} = req
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex], ...body }
    return res.status(200).json(mockUsers[findUserIndex])

})


app.patch('/api/users/:id', resolveIndexByUserId, (req, res)=>{
    const {body, findUserIndex} = req
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}
    console.log(mockUsers);
    
    return res.status(204).send(mockUsers)
})

app.delete('/api/users/:id', resolveIndexByUserId, (req, res)=>{
    const {findUserIndex} = req
    mockUsers.splice(findUserIndex, 1)
    console.log(mockUsers);
    return res.status(200).send(mockUsers)
})


app.get('/api/products', (req, res)=>{
    res.send([
        {id: 123, name: 'chicken Breast', price: '12.99'}
    ])
})

app.listen(PORT, ()=>{
    console.log(`running on Port ${PORT}`)
})