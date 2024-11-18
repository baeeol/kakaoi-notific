import { Router } from "express";
import NotificationController from "./Notification.controller";
import {
  LoginAuthorization,
  TeacherAuthorization,
} from "src/pipe/auth/LoginAuthorization.pipe";

const notificationRouter = Router();
const notificationController = new NotificationController();

notificationRouter.post("/", [LoginAuthorization, notificationController.feature.bind(notificationController)])
notificationRouter.post("/get/list", [
  LoginAuthorization,
  notificationController.findNotificationList.bind(notificationController),
]);
notificationRouter.post("/get/detail", [
  LoginAuthorization,
  notificationController.findNotificationDetail.bind(notificationController),
]);
notificationRouter.post("/post", [
  TeacherAuthorization,
  notificationController.addNotification.bind(notificationController),
]);

export default notificationRouter;