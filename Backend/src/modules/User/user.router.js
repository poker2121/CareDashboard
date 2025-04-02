import { Router } from "express";
import * as userController from './controller/user.js'
import {auth} from "../../middleware/auth.js";
import {asyncErrorHandler} from "../../utils/errorHandler.js";
import {myMulter , fileValidation} from '../../utils/upload.js'


const router = Router();

router.get("/", auth, asyncErrorHandler(userController.getAllUsers))
router.get("/profile/:id", asyncErrorHandler(userController.userProfile))
router.delete("/:id", asyncErrorHandler(userController.deleteUser))
router.put("/updateuser/:id", asyncErrorHandler(userController.userUpdate))

router.put("/updateuserprofile/:id", asyncErrorHandler(userController.personalUpdate))
router.put("/update/:id", myMulter(fileValidation.image).single('image'), asyncErrorHandler(userController.userUpdateProfile))
router.post("/contact", asyncErrorHandler(userController.sendMessage))


export default router
