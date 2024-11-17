import { SubjectType } from "src/constant/Subject";

class UpdateCourseDTO {
  botUserKey: string;
  course: string;

  constructor(botUserKey: string, course: string) {
    this.botUserKey = botUserKey;
    this.course = course;
  }
}

export default UpdateCourseDTO;
