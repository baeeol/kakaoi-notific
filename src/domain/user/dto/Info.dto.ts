import { RoleType } from "../constant/Role";

class InfoDTO {
  botUserKey: string;

  constructor(botUserKey: string) {
    this.botUserKey = botUserKey;
  }
}

export default InfoDTO;
