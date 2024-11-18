class AddAssignmentDTO {
  botUserKey: string;
  title: string;
  article: string;
  imageUrlArray: string[] | null;

  constructor(
    botUserKey: string,
    title: string,
    article: string,
    imageUrlArray: string[] | null
  ) {
    this.botUserKey = botUserKey;
    this.title = title;
    this.article = article;
    this.imageUrlArray = imageUrlArray;
  }
}

export default AddAssignmentDTO;
