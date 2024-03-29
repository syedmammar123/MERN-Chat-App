const mongoose = require('mongoose')

const connetDb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDb connected ${conn.connection.host}`.cyan.underline)
    }
    catch(error){
        console.log(`Error:${error.message}`.red.underline)
        process.exit()
    }
}
module.exports = connetDb