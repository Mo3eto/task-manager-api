require('dotenv').config()

const express = require('express')
require('./db/mongoose')
const app = express() 
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const port = process.env.PORT
  

app.use(express.json())
app.use(userRouter) 
app.use(taskRouter) 
 
const bcrypt = require('bcrypt')





app.listen(port, () => {console.log(`Server Is Up On PORT:`,port)}) 

