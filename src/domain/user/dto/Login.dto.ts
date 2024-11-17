import { RoleType } from "../constant/Role";

class LoginDTO {
  role: RoleType;
  kakaoBotUserKey: string;
  id: string;
  password: string;

  constructor(role: RoleType, kakaoBotUserKey: string, id: string, password: string) {
    this.role = role;
    this.kakaoBotUserKey = kakaoBotUserKey;
    this.id = id;
    this.password = password;
  }
}

export default LoginDTO;
