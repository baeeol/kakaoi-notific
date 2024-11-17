class AddNotificationDTO {
  title: string;
  article: string;
  imageUrlArray: string[] | null;

  constructor(title: string, article: string, imageUrlArray: string[] | null) {
    this.title = title;
    this.article = article;
    this.imageUrlArray = imageUrlArray;
  }
}

export default AddNotificationDTO;
