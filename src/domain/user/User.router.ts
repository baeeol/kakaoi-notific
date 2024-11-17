import { Router } from "express";
import UserController from "./User.controller";
import {
  LoginAuthorization,
  StudentAuthorization,
  TeacherAuthorization,
} from "src/pipe/auth/LoginAuthorization.pipe";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/login", userController.login.bind(userController));
userRouter.post("/register", userController.register.bind(userController));
userRouter.post("/mypage", [
  LoginAuthorization,
  userController.mypage.bind(userController),
]);
userRouter.post("/info/student", [
  StudentAuthorization,
  userController.studentInfo.bind(userController),
]);
userRouter.post("/info/teacher", [
  TeacherAuthorization,
  userController.teacherInfo.bind(userController),
]);
userRouter.post("/put/student/course", [
  StudentAuthorization,
  userController.updateCourse.bind(userController),
]);
userRouter.post("/get/student/course/list", [
  StudentAuthorization,
  userController.findCourseList.bind(userController),
]);

export default userRouter;
