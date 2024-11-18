class RegisterStudentDTO {
  studentId: string;
  password: string;

  constructor(studentId: string, password: string) {
    this.studentId = studentId;
    this.password = password;
  }
}

export default RegisterStudentDTO;
