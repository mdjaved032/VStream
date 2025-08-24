import { Router } from "express";

const demoRouter = Router() ;

demoRouter.post('/login', middleware , userController.login)

export default demoRouter ;