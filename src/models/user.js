const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
        },
    age:{
        type:Number,
        validate: func = (value) => {
            if(value < 0 ) {throw new Error('Not Allowed Negative')}
        }
    },
    email:{ 
        type: String,
        required:true,
        unique:true,
        trim:true,
        validate (value) {
            if(!validator.isEmail(value) ) {throw new Error('Not Allowed Email')}
        }


    },
    password:{
        type: String,
        required:true,
        minlength:5

    },
    avatar:{
        type: Buffer
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

},{
    timestamps:true
}) 

userSchema.virtual('tasks', {
    ref:'Task', 
    localField:'_id',
    foreignField: 'owner' 
})

userSchema.statics.findByCredentials = async (email, password) => { // statics -> is accessible at model 'model methods'
    const user = await User.findOne( {email} )
    if (!user) {
        throw new Error('Unable to login; email')
    }
    const match = await bcrypt.compare(password,user.password)
    if (!match)
    {
        throw new Error('Unable to login; password  ')

    }
    return user


}


userSchema.methods.generateAuthToken = async function ( ) { // methods -> is accessible at instance 'instance methods'
 const user = this
 const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET )
 user.tokens = user.tokens.concat({token})
 await user.save()
 return token
}

// it is called implicitly 'without calling by anyOne' when stringify fun. called anyWhere and res.send call it implicitly
userSchema.methods.toJSON = function() { 
    const user = this
    const objectUser =  user.toObject()
    delete objectUser.password
    delete objectUser.tokens
    delete objectUser.avatar
    return objectUser
}

userSchema.methods.getPublicProfile = function() {
    const user = this
    const objectUser =  user.toObject()
    delete objectUser.password
    delete objectUser.tokens
    delete objectUser.avatar
    return objectUser
}

// userSchema.pre('save', async function(next) {
//     const user = this
//     if(user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }
//     next()
// } )

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany( { owner: user._id} )
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
  