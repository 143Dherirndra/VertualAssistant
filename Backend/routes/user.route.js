import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controller.js"

import express from 'express'
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
export const userRouter= express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
userRouter.post("/askassistant",isAuth,askToAssistant)