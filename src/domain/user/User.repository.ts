import Database from "@config/Database";
import { Student, Teacher } from "./entity";
import { stringify } from "querystring";

class UserRepository {
  private studentRepository = Database.getRepository(Student);
  private teacherRepository = Database.getRepository(Teacher);

  async createStudent(student: Student): Promise<Student> {
    return await this.studentRepository.save(student);
  }

  async createTeacher(teacher: Teacher): Promise<Teacher> {
    return await this.teacherRepository.save(teacher);
  }

  async findStudentByStudentId(studentId: string): Promise<Student | null> {
    return await this.studentRepository.findOne({ where: { student_id: studentId } });
  }

  async findTeacherByName(name: string): Promise<Teacher | null> {
    return await this.teacherRepository.findOne({ where: { name: name } });
  }

  async findStudentByKakaoUserId(kakaoUserId: string): Promise<Student | null> {
    return await this.studentRepository.findOne({
      where: { kakao_user_id: kakaoUserId },
    });
  }

  async findTeacherByKakaoUserId(kakaoUserId: string): Promise<Teacher | null> {
    return await this.teacherRepository.findOne({
      where: { kakao_user_id: kakaoUserId },
    });
  }

  async updateStudentKakaoUserIdById(id: number, kakaoUserKey: string) {
    return await this.studentRepository.update(id, { kakao_user_id: kakaoUserKey });
  }

  async updateTeacherKakaoUserIdById(id: number, kakaoUserKey: string) {
    return await this.teacherRepository.update(id, { kakao_user_id: kakaoUserKey });
  }

  async updateStudentCourseById(id: number, course: string) {
    return await this.studentRepository.update(id, { course });
  }
}

export default UserRepository;
