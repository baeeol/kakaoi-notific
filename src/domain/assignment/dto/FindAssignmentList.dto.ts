class FindAssignmentListDTO {
  botUserKey: string;
  page: number;

  constructor(botUserKey: string, page: number) {
    this.botUserKey = botUserKey;
    this.page = page;
  }
}

export default FindAssignmentListDTO;
