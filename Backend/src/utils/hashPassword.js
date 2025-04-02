import bcrypt from  'bcryptjs'


// ///////////// hash password ////////////////
export const hashPassword = (password, salt=process.env.SALT_ROUND)=>{
    const hashedPassword =  bcrypt.hashSync(password, parseInt(salt));
    return hashedPassword;
}

// //////////// compare password ////////////////
export const comparePassword = (password, hashedPassword)=>{
    const check =  bcrypt.compareSync(password, hashedPassword);
    return check;
}
