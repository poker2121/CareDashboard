import authRouter from './modules/Auth/auth.router.js'
import userRouter from './modules/User/user.router.js'
import connectDB from '../DB/dbConnection.js'
import { globalErrorHandling } from './utils/errorHandler.js'

const initApp = (app, express)=>{
    app.use(express.json());

    // route to check connection and server status
    app.get('/' , (req , res)=>{
       res.send('hello from simple server :)')
    })

    // routes
    app.use('/auth', authRouter)
    app.use('/user', userRouter)

    app.all("*", (req, res, next)=>{
        return res.json({message: "invalid router"})
    })
    // global error handlling
    app.use(globalErrorHandling)
    connectDB();
}

export default initApp
