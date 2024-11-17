import { Router } from "express";
import AssignmentController from "./Assignment.controller";
import {
  LoginAuthorization,
  TeacherAuthorization,
} from "src/pipe/auth/LoginAuthorization.pipe";

const assignmentRouter = Router();
const assignmentController = new AssignmentController();

assignmentRouter.post("/get/list", [
  LoginAuthorization,
  assignmentController.findAssignmentList.bind(assignmentController),
]);
assignmentRouter.post("/get/detail", [
  LoginAuthorization,
  assignmentController.findAssignmentDetail.bind(assignmentController),
]);
assignmentRouter.post("/post", [
  TeacherAuthorization,
  assignmentController.addAssignment.bind(assignmentController),
]);

export default assignmentRouter;
