import userModel from "../../../../DB/models/user.model.js";
import { sendEmail } from "../../../utils/emailService.js";
import { ResError } from "../../../utils/errorHandler.js";
import { comparePassword, hashPassword } from "../../../utils/hashPassword.js";
import { generateToken, verifyToken } from "../../../utils/token.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { emailTemplete } from "../../../utils/emailTemplet.js";


// //////////// signup ////////////////////
export const signup = async (req, res, next)=>{
    console.log(req.body);
    const validation = signupSchema.validate(req.body, {abortEarly: false});
    //check if there any error in validation schema
    if(validation.error){
        return res.json({message: "validation error", validation: validation.error.details})
    }

    // In case validation passed continue ...
    const {firstName, lastName, email, password} = req.body;
    const check = await userModel.findOne({email});

    // check if user already in DB
    if(check){
        return next(new ResError('Email already exists', 209))
    }

    // for new user -> send confirm Email
    const token = generateToken({payload:{email}});

    // const verifyLink = `http://localhost:5000/auth/confirm/${token}`;
    const unsupscripe = `${req.protocol}://${req.headers.host}/auth/unsupscripe/${token}`;
    const verifyLink = `${req.protocol}://${req.headers.host}/auth/confirm/${token}`;

    const html = emailTemplete(verifyLink, unsupscripe);
    
    console.log(email);
    await sendEmail({to: email, subject: 'Confirmation Email', html})
 
    // after confirm email hash password and save in DB
    const hashPass = hashPassword(password);
    const user = await userModel.create({
        name:{
            firstName,
            lastName
        },
        email,
        password:hashPass
    })
    return res.status(201).json({message: "please, Confirm your account", user: user._id})
}
////////////// login /////////////////////
export const login = async (req, res, next)=>{
    // const validation = loginSchema.validate(req.body, {abortEarly: false});
    // //check if there any error in validation schema
    // if(validation.error){
    //     return res.json({message: "validation error", validation: validation.error.details})
    // }
    // In case validation passed continue ...
    const {email, password} = req.body;
    const check = await userModel.findOne({email});
    if(!check){
        return next(new ResError('Email not exist, please register first', 404 ))
    }
    // compare password with hashed password in DB
    const same = comparePassword(password, check.password);
    if(!same){
        return next(new ResError('incorrect Email or Password', 400 ))
    }

    // check if user is confirmed
    if(!check.isConfirm){
        return next(new ResError('Please confirm your account', 400 ))
    }

    // change status to online , isLoggedIn to true
    check.status = 'online';
    check.isLoggedIn = true;

    await check.save();
    // return token to frontend
    const token = generateToken({payload:{id: check._id, isLoggedIn: true, role: check.role, name: check.name.firstName}});
    return res.status(200).json({message: "login success", token})
}

/////////////// confirm email /////////////////////
export const confirm = async (req, res, next)=>{
    const {token} = req.params;
    // decode token to get user info
    console.log(token);
    const {email} = verifyToken(token);
    // update user in DB to be confirmed user
    const user = await userModel.updateOne({ email }, {isConfirm: true });
    // if updated done redirect user to login page
    return user.modifiedCount ? res.status(200).redirect(`http://localhost:5173/login`) :
                                res.status(404).send('Not registered account').redirect(`http://localhost:5173/signup`);
}

////////////////////// unspscripe email /////////////////
export const removeAccount = async (req, res, next) => {
    const {token} = req.params;
    // decode token to get user info
    console.log(token);
    const {email} = verifyToken(token);
    // update user in DB to be confirmed user
    const user = await userModel.findOneAndDelete({ email });
    console.log(user);
    // if updated done redirect user to login page
    return user?.isConfirm === false ? res.status(200).redirect(`http://localhost:3000/register`) :
                                res.status(404).send('oops ... something wrong');
}

 /// =========== logOut =============== ///
 export const logout = async (req,res,next)=>{

    const { id } = req.body;
    console.log(req.body);
    const userCheck = await userModel.findOne({ _id: id }); 
    if(userCheck.isLoggedIn == false) 
    { return next(new ResError('you are already logout' , 400 ))}
    if(userCheck){
        await userModel.updateOne({_id:userCheck._id} , {isLoggedIn:false, status:'offline'},{new:true})
        res.status(200).json({message:'logged out successfuly'})
      }else{
      return next(new ResError('fail to logout' , 400 ))
  
    }
   }
   
    /// =========== changePassword =============== ///
   export const changePassword = async (req, res,next) => {

   const { email, oldpassword , newpassword } = req.body;
        const userCheck = await userModel.findOne({ email }); 
        if(userCheck){
          const check = comparePassword(oldpassword, userCheck.password);
          console.log(check);
          if (check) {
            const newPass = hashPassword(newpassword);
            await userModel.findOneAndUpdate({_id:userCheck._id} , {password:newPass})
                res.status(200).json({ message: "changed Successfuly" })
          } else {
            res.status(200).json({ message: "wrong email or password" })
          }
      } else {
        return next(new ResError('fail',400));
      }
  };
