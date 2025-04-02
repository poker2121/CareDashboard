import multer from 'multer';

// validation on image extention
export const fileValidation = {
    image : ['image/jpeg','image/jpg','image/gif','image/png'],
}

// to can find image from local
export const myMulter = (customValidation=[])=>{

    const storage = multer.diskStorage({})

    const fileFilter =(req, file, cb)=>{
        if(customValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb("in valid formate",false);
        }
    }

    const upload = multer({fileFilter,storage});
    return upload;
}
