import mongoose from 'mongoose';


const connectDB = async()=>{
    return await mongoose.connect('mongodb://0.0.0.0:27017/CarePharmacy')
    .then(()=>{console.log('DB connected successfuly')})
    .catch((e)=>{console.log(`fail to connect DB ... ${e}`)})
}
// mongodb://0.0.0.0:27017/CarePharmacy

export default connectDB;