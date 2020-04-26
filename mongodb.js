const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'taskManager'
const ObjectID = mongodb.ObjectID
MongoClient.connect(connectionURL, {useNewUrlParser: true,useUnifiedTopology: true}, (error,client) => {
    if (error)
    {
        return console.log('Unable To Connect To DataBase')
    }
    const db = client.db(databaseName)
    db.collection('users').updateMany
    (
        {
           
         },
        {
            $rename: {
                'id':'FCI_ID'
            }
            
        }

    ).then( (result) => {
        console.log(result)
    }).catch( (error) => {
        console.log(error)
    })

     })