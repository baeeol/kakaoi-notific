import { Request, Response } from "express";
import { RoleName, RoleType } from "src/domain/user/constant/Role";
import UserRepository from "src/domain/user/User.repository";
import KakaoBotResponse from "src/response/KakaoBotResponse";

async function _getUserRole(botUserKey: string): Promise<RoleType | null> {
  const userRepository = new UserRepository();

  let user = null;

  user = await userRepository.findTeacherByKakaoUserId(botUserKey);
  if (user) {
    return user.role;
  }

  user = await userRepository.findStudentByKakaoUserId(botUserKey);
  if (user) {
    return user.role;
  }

  return null;
}

async function LoginAuthorization(req: Request, res: Response, next: Function) {
  // level 1 authorization

  const userRole = await _getUserRole(req.body.botUserKey);

  // 로그인을 하지 않은 유저
  if (!userRole) {
    const response = new KakaoBotResponse();
    response.addSimpleTextOutput("먼저 로그인을 해주세요!");
    res.status(200).send(response.getData());
    return;
  }

  req.body = { ...req.body, role: userRole };

  return next();
}

async function StudentAuthorization(req: Request, res: Response, next: Function) {
  // level 2 authorization

  const userRole = await _getUserRole(req.body.botUserKey);

  if (userRole !== RoleName.STUDENT) {
    const response = new KakaoBotResponse();
    response.addSimpleTextOutput("학생만 이용 가능한 기능입니다.");
    res.status(200).send(response.getData());
    return;
  }

  req.body = { ...req.body, role: userRole };

  return next();
}

async function TeacherAuthorization(req: Request, res: Response, next: Function) {
  // level 2 authorization

  const userRole = await _getUserRole(req.body.botUserKey);

  if (userRole !== RoleName.TEACHER) {
    const response = new KakaoBotResponse();
    response.addSimpleTextOutput("선생님만 이용 가능한 기능입니다.");
    res.status(200).send(response.getData());
    return;
  }

  req.body = { ...req.body, role: userRole };

  return next();
}

export { LoginAuthorization, StudentAuthorization, TeacherAuthorization };
