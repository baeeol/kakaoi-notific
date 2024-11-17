import { RoleType } from "../constant/Role";
class RegisterDTO {
  role: RoleType;
  id: string;
  password: string;

  constructor(role: RoleType, id: string, password: string) {
    this.role = role;
    this.id = id;
    this.password = password;
  }
}

export default RegisterDTO;
