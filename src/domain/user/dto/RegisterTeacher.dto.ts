import { SubjectType } from "src/constant/Subject";

class RegisterTeacherDTO {
  name: string;
  password: string;
  major: SubjectType;

  constructor(name: string, password: string, major: SubjectType) {
    this.name = name;
    this.password = password;
    this.major = major;
  }
}

export default RegisterTeacherDTO;
