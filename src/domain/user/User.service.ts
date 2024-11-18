import UserRepository from "./User.repository";
import ServiceException from "@exception/Service.exception";
import { RoleName } from "./constant/Role";
import {
  LoginDTO,
  RegisterStudentDTO,
  RegisterTeacherDTO,
  InfoDTO,
  UpdateCourseDTO,
  FindCourseListDTO,
  FindCourseDTO,
} from "./dto";
import bcrypt from "bcrypt";
import { Student, Teacher } from "./entity";
import { LIST_OF_SUBJECT, SubjectType } from "src/constant/Subject";
import ImageFileService from "src/image/ImageFile.service";

type CourseListItem = {
  subjectName: string;
  isTaking: boolean;
};

class UserService {
  private userRepository = new UserRepository();
  private imageFileService = new ImageFileService();

  async login(loginDTO: LoginDTO) {
    try {
      const { role, kakaoBotUserKey, id, password } = loginDTO;

      // id가 DB에 존재하는지 확인
      let user = null;
      switch (role) {
        case RoleName.STUDENT:
          user = await this.userRepository.findStudentByStudentId(id);
          break;

        case RoleName.TEACHER:
          user = await this.userRepository.findTeacherByName(id);
          break;
      }
      if (!user) {
        throw new ServiceException("id is not exist");
      }

      // password가 일치하는지 확인
      if (!bcrypt.compareSync(password, user.password)) {
        throw new ServiceException("password is not same");
      }

      // kakao bot user key를 등록
      switch (role) {
        case RoleName.STUDENT:
          await this.userRepository.updateStudentKakaoUserIdById(
            user.id,
            kakaoBotUserKey
          );
          break;

        case RoleName.TEACHER:
          await this.userRepository.updateTeacherKakaoUserIdById(
            user.id,
            kakaoBotUserKey
          );
          break;
      }
    } catch (e) {
      throw e;
    }
  }

  async registerStudent(registerStudentDTO: RegisterStudentDTO) {
    try {
      const { studentId, password } = registerStudentDTO;
      const salt = bcrypt.genSaltSync();
      const digest = bcrypt.hashSync(password, salt);

      const student = new Student(studentId, digest, RoleName.STUDENT);
      await this.userRepository.createStudent(student);
    } catch (e) {
      throw e;
    }
  }

  async registerTeacher(registerTeacherDTO: RegisterTeacherDTO) {
    try {
      const { name, password, major } = registerTeacherDTO;
      const salt = bcrypt.genSaltSync();
      const digest = bcrypt.hashSync(password, salt);

      const teacher = new Teacher(name, digest, major, RoleName.STUDENT);
      await this.userRepository.createTeacher(teacher);
    } catch (e) {
      throw e;
    }
  }

  async findStudent(
    infoDTO: InfoDTO
  ): Promise<{ studentId: string; course: SubjectType[] }> {
    try {
      const { botUserKey } = infoDTO;

      const student = await this.userRepository.findStudentByKakaoUserId(botUserKey);
      if (!student) {
        throw new ServiceException(`student bot user key ${botUserKey} is not exist`);
      }

      const { student_id, course } = student;

      return { studentId: student_id, course: JSON.parse(course) };
    } catch (e) {
      throw e;
    }
  }

  async findTeacher(infoDTO: InfoDTO): Promise<{ name: string }> {
    try {
      const { botUserKey } = infoDTO;

      const teacher = await this.userRepository.findTeacherByKakaoUserId(botUserKey);
      if (!teacher) {
        throw new ServiceException(`teacher bot user key ${botUserKey} is not exist`);
      }

      const { name } = teacher;

      return { name };
    } catch (e) {
      throw e;
    }
  }

  async updateCourse(updateCourseDTO: UpdateCourseDTO) {
    try {
      const { botUserKey, course } = updateCourseDTO;

      const user = await this.userRepository.findStudentByKakaoUserId(botUserKey);
      if (!user) {
        throw new ServiceException(`user bot user key ${botUserKey} is not exist`);
      }
      const { id } = user;

      await this.userRepository.updateStudentCourseById(id, course);
    } catch (e) {
      throw e;
    }
  }

  async findCourse(findCourseDTO: FindCourseDTO) {
    const { botUserKey } = findCourseDTO;

    const user = await this.userRepository.findStudentByKakaoUserId(botUserKey);
    if (!user) {
      throw new ServiceException(`user bot user key ${botUserKey} is not exist`);
    }

    return JSON.parse(user.course);
  }

  async findCourseList(
    findCourseListDTO: FindCourseListDTO
  ): Promise<[CourseListItem[], boolean]> {
    try {
      const { page, course } = findCourseListDTO;

      const COURSE_LIST_SIZE = 5;
      const START_IDX = (page - 1) * COURSE_LIST_SIZE + 1;
      let END_IDX = (page - 1) * COURSE_LIST_SIZE + 1 + COURSE_LIST_SIZE;
      if (END_IDX >= LIST_OF_SUBJECT.length) {
        END_IDX = LIST_OF_SUBJECT.length;
      }
      const showedCourseArray = LIST_OF_SUBJECT.slice(START_IDX, END_IDX);

      const courseList = showedCourseArray.map((showedCourse) => {
        return {
          subjectName: showedCourse,
          isTaking: course.includes(showedCourse),
        };
      });

      let isEndPage = false;
      if (showedCourseArray.length < 5 || END_IDX === LIST_OF_SUBJECT.length) {
        isEndPage = true;
      }

      return [courseList, isEndPage];
    } catch (e) {
      throw e;
    }
  }
}

export default UserService;
