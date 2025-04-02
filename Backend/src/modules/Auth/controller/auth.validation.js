import joi from 'joi';

//////////////////// signup validation /////////////////////
export const signupSchema = joi.object({
    firstName: joi.string().min(3).max(15).required(),
    lastName: joi.string().min(3).max(15).required(),
    email: joi.string().min(3).max(30).required().email(),
    //// password must be at least 8 char , one letter , one number
    password: joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required(),
}).required();

/////////////////// login validation /////////////////////
export const loginSchema = joi.object({
    email: joi.string().min(3).max(30).required().email(),
    password: joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required()
}).required();

