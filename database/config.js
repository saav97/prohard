const mongoose = require('mongoose');

const dbConecction = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true
        },
        { useFindAndModify: false });
        console.log('DB Online')
    } catch (error) {
        console.log(error)
    } 


}

module.exports = dbConecction