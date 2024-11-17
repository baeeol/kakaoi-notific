import { Router } from "express";
import userRouter from "src/domain/user/User.router";
import notificationRouter from "src/domain/notification/Notification.router";
import appMiddleware from "./app.middleware";
import assignmentRouter from "src/domain/assignment/Assignment.router";

const appRouter = Router();

// middleware
appRouter.use("/", appMiddleware);

// routing
appRouter.use("/user", userRouter);
appRouter.use("/notification", notificationRouter);
appRouter.use("/assignment", assignmentRouter);

export default appRouter;
