import { SubjectType } from "src/constant/Subject";

class FindCourseListDTO {
  page: number;
  course: SubjectType[];

  constructor(page: number, course: SubjectType[]) {
    this.page = page;
    this.course = course;
  }
}

export default FindCourseListDTO;
