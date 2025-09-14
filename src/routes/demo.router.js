import { Router } from "express";
import middleware from "../middlewares/auth.middleware.js" ;
import userController from "../controllers/user.controller.js" ;

const demoRouter = Router() ;

demoRouter.post('/login', middleware , userController.login)

export default demoRouter ;