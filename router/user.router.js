import express from 'express';
import { loginUser, registerUser, loggedOutUser } from '../controller/user.controller.js';
import { verifyjwt } from '../middleware/auth.middleware.js';

const router = express();

router.post("/register", registerUser)
router.post("/login", loginUser)

// secured routes
router.get("/logout", verifyjwt, loggedOutUser)


export const userRouter  =  router