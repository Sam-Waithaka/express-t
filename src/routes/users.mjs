import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationsSchema } from "../utils/validationSchema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schema/user.js";
import { reconstructFieldPath } from "express-validator/lib/field-selection.js";

const router = Router()

router.get(
    '/api/users', 
    query('filter')
        .isString()
        .notEmpty()
        .withMessage('Must not be Empty')
        .isLength({min: 3, max: 10})
        .withMessage('Must be atleast 3 - 10 characters'),

    (req, res) => {
        console.log('From get "/api/users" ');
        
        console.log(req.session);
        console.log(req.session.id);
        req.sessionStore.get(req.session.id, (err, sessionData)=>{
            if (err) {
                console.log(err);
                throw err  
            }
            console.log(sessionData);
            
        })
        
    
        const result = validationResult(req)
        console.log(result);
        
        const { filter, value } = req.query

        if (filter && value) {
            return res.send(
                mockUsers.filter(user => user[filter].includes(value))
            )
        }

        return res.send(mockUsers)
    }
)


router.post(
    '/api/users', 
    checkSchema(createUserValidationsSchema), 
    async (req, res)=>{

        const result = validationResult(req)

        if (!result.isEmpty())
            return res.status(400).send(result.array())

        const data = matchedData(req)
        const newUser = new User(data)
        console.log(data)
        
        try {
            const savedUser = await newUser.save()
            return res.status(201).send(savedUser)
        } catch (error) {
            console.log(error);
            return res.sendStatus(400)
        }
})


router.get('/api/users/:id', resolveIndexByUserId, (req, res)=>{
    const {findUserIndex} = req
    if (!findUser) return res.status(404).send({message: 'User not found'})
    return res.send(findUser)   
})

router.put('/api/users/:id', resolveIndexByUserId, (req, res)=>{

    const {body, findUserIndex} = req
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex], ...body }
    return res.status(200).json(mockUsers[findUserIndex])

})


router.patch('/api/users/:id', resolveIndexByUserId, (req, res)=>{
    const {body, findUserIndex} = req
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}
    console.log(mockUsers);
    
    return res.status(204).send(mockUsers)
})

router.delete('/api/users/:id', resolveIndexByUserId, (req, res)=>{
    const {findUserIndex} = req
    mockUsers.splice(findUserIndex, 1)
    console.log(mockUsers);
    return res.status(200).send(mockUsers)
})

export default router