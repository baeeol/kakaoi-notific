import NotificationRepository from "./Notification.repository";
import ImageFileService, { DirNameType } from "src/image/ImageFile.service";
import Notification from "./entity/Notification.entity";
import ServiceException from "@exception/Service.exception";
import {
  AddNotificationDTO,
  FindNotificationDetailDTO,
  FindNotificationListDTO,
} from "./dto";

export type notificationListItem = {
  id: number;
  title: string;
};

export type notificationDetail = {
  title: string;
  article: string;
  imageUrlArray: string[] | null;
};

class NotificationService {
  private notificationRepository = new NotificationRepository();
  private imageFileService = new ImageFileService();

  async findNotificationList(
    findnotificationListDTO: FindNotificationListDTO
  ): Promise<[notificationListItem[], boolean]> {
    try {
      const { page } = findnotificationListDTO;
      const NOTIFICATION_LIST_SIZE = 5;

      const [notificationEntityArray] =
        await this.notificationRepository.findWithPagination(
          NOTIFICATION_LIST_SIZE,
          page
        );

      const notificationAraay = notificationEntityArray.map((notificationEntity) => {
        const { id, title } = notificationEntity;

        // 글자 길이 조정
        const TITLE_LENGTH_LIMIT = 30;
        let notificationTitle = title;
        if (title.length > TITLE_LENGTH_LIMIT) {
          notificationTitle = title.substring(0, TITLE_LENGTH_LIMIT - 3).concat("...");
        }

        return { id, title: notificationTitle };
      });

      // 마지막 페이지인지 체크
      let isEndPage = false;
      const [nextPageNotificationArray] =
        await this.notificationRepository.findWithPagination(
          NOTIFICATION_LIST_SIZE,
          page + 1
        );
      if (
        notificationAraay.length < NOTIFICATION_LIST_SIZE ||
        nextPageNotificationArray.length === 0
      ) {
        isEndPage = true;
      }

      return [notificationAraay, isEndPage];
    } catch (e) {
      throw new ServiceException(`예상치 못한 오류가 발생하였습니다. ${e}`);
    }
  }

  async findNotificationDetail(findNotificationDetailDTO: FindNotificationDetailDTO) {
    try {
      const { id } = findNotificationDetailDTO;

      const notificationEntity = await this.notificationRepository.findById(id);
      if (!notificationEntity) {
        throw new ServiceException(`notification id ${id} is not exist`);
      }

      const { title, article, image_dir } = notificationEntity;
      let imageUrlArray = null;
      if (image_dir) {
        imageUrlArray = this.imageFileService.getAllImageUrl(image_dir as DirNameType);
      }
      const notificationDetail = { title, article, imageUrlArray };

      return notificationDetail;
    } catch (e) {
      throw e;
    }
  }

  async addNotification(addNotificationDTO: AddNotificationDTO) {
    try {
      const { title, article, imageUrlArray } = addNotificationDTO;

      const imageDirName = imageUrlArray
        ? await this.imageFileService.saveImageInRandomDir(imageUrlArray)
        : null;

      const notification = new Notification(title, article, imageDirName);
      await this.notificationRepository.create(notification);
    } catch (e) {
      throw new ServiceException(`예상치 못한 오류가 발생하였습니다. ${e}`);
    }
  }
}

export default NotificationService;
