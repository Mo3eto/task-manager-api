const express = require('express')
const  router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post( '/tasks', auth, async (req, res) => {
    const task = Task({
        ...req.body,
        owner: req.user._id

    }) 
    try{
        await task.save()
    res.status(201).send(task)
    }
    catch(e) {
        res.status(400).send(e)
    }
 } )

 router.get('/tasks', auth, async (req, res) => {
     const match = {}
     const sort = {}
     if( req.query.completed ) {
         match.completed = req.query.completed === 'true'
     }

     if(req.query.sortBy) {
         const parts = req.query.sortBy.split('_')
         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
     }

    try{ 
        // to get the tasks of a user

        //  await Task.find()
        // await Task.populate({
        //     path:'tasks',
        //     match,
        //     options:{
        //     limit:parseInt(req.query.limit),
        //     skip:parseInt(req.query.skip)
        //     }
        // })
        // res.send(tasks)

        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send( req.user.tasks)
      
        
    }
    catch(e){
        res.status(500).send(e) 
    }
   
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id   
    try{
        const task = await Task.findOne({_id:_id, owner: req.user._id})      
            if(!task) { return res.status(404).send('You cannot access this task') }
              //to get the owner of the task
                // await task.populate('owner').execPopulate() >> now the 'owner' property has the whole user 
                //res.send( task.owner)
        
            res.send(task)
         
    } 
  catch (e) {
        res.status(500).send(e)
    } 
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const valid = updates.every((update) => allowedUpdates.includes(update))
    if(!valid) {
        return res.status(400).send('400 Not valid updates')
    }

    try {
        const task = await Task.findOne({_id:_id, owner: req.user._id})

        if(!task){ return res.status(400).send('cannot update this task')}

        updates.forEach( (update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch (e) {
        res.status(500).send()
    } 
})

router.delete('/tasks/:id', auth,  async(req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id:_id, owner: req.user._id})

        if (!task) { return res.status(400).send('cannot delete this task ') }
        res.send(task)
    }
    catch (e) {
        res.status(500).send('500Not')
    }
})






module.exports = router