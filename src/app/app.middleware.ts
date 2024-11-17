import { Router } from "express";
import RequestBodyMiddleware from "src/middleware/request/RequestBody.pipe";

const appMiddleware = Router();

// middleware
appMiddleware.use("/", RequestBodyMiddleware);

export default appMiddleware;
