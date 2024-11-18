import { Request, Response } from "express";
import UserService from "./User.service";
import KakaoBotResponse, {
  BlockName,
  Button,
  CustomBoardItemData,
} from "src/response/KakaoBotResponse";
import { RoleName } from "../user/constant/Role";
import {
  FindCourseListDTO,
  InfoDTO,
  LoginDTO,
  RegisterStudentDTO,
  RegisterTeacherDTO,
  UpdateCourseDTO,
} from "./dto";
import ServiceException from "@exception/Service.exception";

class UserController {
  private userService = new UserService();

  async login(req: Request, res: Response) {
    try {
      const botUserKey = req.body.userRequest.user.id;
      const { roleName, id, password } = req.body.action.params;

      // role을 RoleType으로 변환
      let role = "";
      switch (roleName) {
        case "학생":
          role = RoleName.STUDENT;
          break;
        case "선생님":
          role = RoleName.TEACHER;
          break;
      }

      const loginDTO = new LoginDTO(role, botUserKey, id, password);
      await this.userService.login(loginDTO);

      const response = new KakaoBotResponse();
      response.addSimpleTextOutput("로그인에 성공하였습니다!");
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);

      let responseText = "";
      if (e instanceof ServiceException) {
        switch (e.reason) {
          case "id is not exist":
            responseText = "학번 또는 이름이 잘못되었습니다!";
            break;

          case "password is not same":
            responseText = "비밀번호가 잘못되었습니다!";
            break;
        }
      }

      const response = new KakaoBotResponse();
      response.addSimpleTextOutput(responseText);
      res.status(200).send(response.getData());
    }
  }

  async registerStudent(req: Request, res: Response) {
    try {
      const { studentId, password } = req.body;

      const registerStudentDTO = new RegisterStudentDTO(studentId, password);
      await this.userService.registerStudent(registerStudentDTO);

      res.status(200).send();
    } catch (e) {
      console.log(e);
    }
  }

  async registerTeacher(req: Request, res: Response) {
    try {
      const { name, password, major } = req.body;

      const registerTeacherDTO = new RegisterTeacherDTO(name, password, major);
      await this.userService.registerTeacher(registerTeacherDTO);

      res.status(200).send();
    } catch (e) {
      console.log(e);
    }
  }

  async mypage(req: Request, res: Response) {
    const { role } = req.body;

    const response = new KakaoBotResponse();
    if (role === RoleName.STUDENT) {
      this._setStudentMypageResponse(response);
    } else if (role === RoleName.TEACHER) {
      this._setTeacherMypageResponse(response);
    }

    res.status(200).send(response.getData());
  }

  _setStudentMypageResponse(response: KakaoBotResponse) {
    response.addSimpleTextOutput("학생 마이페이지 기능");
    response.addQuickReplie({
      label: "내 정보",
      action: "block",
      blockId: BlockName.STUDENT_INFO_CHECK,
    });
    response.addQuickReplie({
      label: "수강 목록 변경",
      action: "block",
      blockId: BlockName.STUDENT_COURSE_LIST_CHECK,
    });
  }

  _setTeacherMypageResponse(response: KakaoBotResponse) {
    response.addSimpleTextOutput("선생님 마이페이지 기능");
    response.addQuickReplie({
      label: "내 정보",
      action: "block",
      blockId: BlockName.TEACHER_INFO_CHECK,
    });
  }

  async studentInfo(req: Request, res: Response) {
    try {
      const { botUserKey } = req.body;

      const infoDTO = new InfoDTO(botUserKey);
      const student = await this.userService.findStudent(infoDTO);

      const { studentId, course } = student;

      const response = new KakaoBotResponse();
      response.addSimpleTextOutput(
        `학번 : ${studentId}\n역할 : 학생\n수강 과목: ${JSON.stringify(course).slice(
          1,
          -1
        )}`
      );
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }

  async teacherInfo(req: Request, res: Response) {
    try {
      const { botUserKey } = req.body;

      const infoDTO = new InfoDTO(botUserKey);
      const teacher = await this.userService.findTeacher(infoDTO);

      const { name } = teacher;

      const response = new KakaoBotResponse();
      response.addSimpleTextOutput(`성함 : ${name}\n역할 : 선생님`);
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }

  async updateCourse(req: Request, res: Response) {
    try {
      const { botUserKey } = req.body;
      const { course } = req.body.extraParams;

      const updateCourseDTO = new UpdateCourseDTO(botUserKey, course);
      await this.userService.updateCourse(updateCourseDTO);

      const response = new KakaoBotResponse();
      response.addSimpleTextOutput(`수강 과목이 수정되었습니다!`);
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }

  async findCourseList(req: Request, res: Response) {
    try {
      const { botUserKey } = req.body;
      const page = req.body.extraParams.page || 1;
      let course = null;
      if (req.body.extraParams?.course) {
        course = JSON.parse(req.body.extraParams.course);
      } else {
        course = await this.userService.findCourse(botUserKey);
      }

      const findCourseListDTO = new FindCourseListDTO(page, course);
      const [courseList, isEndPage] = await this.userService.findCourseList(
        findCourseListDTO
      );

      const header = `과목 목록 (${page}페이지)`;
      const itemDataArray: CustomBoardItemData[] = courseList.map((courseListItem) => {
        const { subjectName, isTaking } = courseListItem;
        let courseParam = [...course];
        if (isTaking) {
          // 과목을 수강 중이라면 수강하지 않게 변경
          const indexOfSubject = courseParam.indexOf(subjectName);
          courseParam.splice(indexOfSubject, 1);
        } else {
          // 과목을 수강하지 않은 중이라면 수강 중으로 변경
          courseParam.push(subjectName);
        }

        return {
          title: `${subjectName} ${isTaking ? "[수강중]" : ""}`,
          params: { course: JSON.stringify(courseParam), page },
        };
      });
      const extraButton: Button[] = [
        {
          label: "저장",
          action: "block",
          blockId: BlockName.STUDENT_COURSE_LIST_MODIFY,
          extra: { course: JSON.stringify(course) },
        },
      ];

      const response = new KakaoBotResponse();
      response.addCustomBoard(
        header,
        itemDataArray,
        BlockName.STUDENT_COURSE_LIST_CHECK,
        BlockName.STUDENT_COURSE_LIST_CHECK,
        page,
        isEndPage,
        extraButton
      );
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }
}

export default UserController;
