import jwt from 'jsonwebtoken';

// generate token
export const generateToken = ({payload={} , signature = process.env.TOKEN_SIGNATURE,
    expiresIn=60*60}={})=>{
        const token = jwt.sign(payload,signature,{expiresIn})
        return token
    }

/// verify token
export const verifyToken = (token)=>{
    const decode = jwt.verify(token , process.env.TOKEN_SIGNATURE);
    return decode
}