const { connect } = require('mongoose')
const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI)
        console.log('database terkoneksi')
    }
    catch (err) {
        console.log(err.message)
    }
}
module.exports = connectDB