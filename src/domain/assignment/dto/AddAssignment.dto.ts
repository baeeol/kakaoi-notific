class AddAssignmentDTO {
  title: string;
  article: string;
  subject: string;
  imageUrlArray: string[] | null;

  constructor(
    title: string,
    article: string,
    subject: string,
    imageUrlArray: string[] | null
  ) {
    this.title = title;
    this.article = article;
    this.subject = subject;
    this.imageUrlArray = imageUrlArray;
  }
}

export default AddAssignmentDTO;
