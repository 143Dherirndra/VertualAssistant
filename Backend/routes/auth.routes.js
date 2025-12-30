import express from 'express'
import { Login, LogOut, signup } from '../controllers/auth.controller.js';

const authRouter= express.Router()
authRouter.post("/signup",signup)
authRouter.post("/signIn",Login)
authRouter.get("/LogOut",LogOut)
export default authRouter;
