import { Router } from "express";
import * as authController from './controller/auth.js'
import asyncHandler from 'express-async-handler'


const router = Router();

router.get("/", asyncHandler(authController.getAuthModule))
router.post("/signup", asyncHandler(authController.signup))
router.post("/login", asyncHandler(authController.login))
router.get("/confirm/:token", asyncHandler(authController.confirm))
router.get("/unsupscripe/:token", asyncHandler(authController.removeAccount))

router.post("/logout", asyncHandler(authController.logout))
router.put("/changePassword", asyncHandler(authController.changePassword))


export default router
