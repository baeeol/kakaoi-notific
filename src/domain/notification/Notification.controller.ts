import { Request, Response } from "express";
import NotificationService from "./Notification.service";
import KakaoRequestUtil from "src/utils/KakaoRequest.util";
import KakaoBotResponse, {
  BlockName,
  Button,
  CustomBoardItemData,
} from "src/response/KakaoBotResponse";
import {
  AddNotificationDTO,
  FindNotificationDetailDTO,
  FindNotificationListDTO,
} from "./dto";

class NotificationController {
  private notificationService = new NotificationService();

  async findNotificationList(req: Request, res: Response) {
    try {
      const pageParam = req.body.extraParams.page;
      const page = pageParam ? pageParam : 1;

      const findnotificationListDTO = new FindNotificationListDTO(parseInt(page));
      const [notificationList, isEndPage] =
        await this.notificationService.findNotificationList(findnotificationListDTO);

      const header = `학교 공지 목록 (${page}페이지)`;
      const itemDataArray: CustomBoardItemData[] = notificationList.map(
        (notification) => {
          const { id, title } = notification;
          return {
            title: `(${id}) ${title}`,
            params: {
              notificationId: id,
              page,
            },
          };
        }
      );

      const response = new KakaoBotResponse();
      response.addCustomBoard(
        header,
        itemDataArray,
        BlockName.NOTIFICATION_LIST_CHECK,
        BlockName.NOTIFICATION_DETAIL_CHECK,
        page,
        isEndPage
      );
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }

  async findNotificationDetail(req: Request, res: Response) {
    try {
      const { notificationId, page } = req.body.extraParams;

      const findNotificationDetailDTO = new FindNotificationDetailDTO(
        parseInt(notificationId)
      );
      const notificationDetail = await this.notificationService.findNotificationDetail(
        findNotificationDetailDTO
      );

      const { title, article, imageUrlArray } = notificationDetail;
      const textCardButtonArray: Button[] = [
        {
          label: "돌아가기",
          action: "block",
          blockId: BlockName.NOTIFICATION_LIST_CHECK,
          extra: { page },
        },
      ];

      const response = new KakaoBotResponse();
      response.addTextCardOutput(title, article, textCardButtonArray);
      imageUrlArray?.forEach((imageUrl) => {
        response.addSimpleImageOutput(imageUrl, "학교 공지에 첨부된 이미지입니다.");
      });
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }

  async addNotification(req: Request, res: Response) {
    try {
      const { title, article, image } = req.body.params;
      const imageUrlArray: string[] | null = image
        ? KakaoRequestUtil.getSecureImageUrlArray(image)
        : null;

      const addNotificationDTO = new AddNotificationDTO(title, article, imageUrlArray);
      await this.notificationService.addNotification(addNotificationDTO);

      const response = new KakaoBotResponse();
      response.addSimpleTextOutput("학교 공지가 등록되었습니다!");
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }
}

export default NotificationController;
