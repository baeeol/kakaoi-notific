import { Request, Response } from "express";
import AssignmentService from "./Assignment.service";
import KakaoRequestUtil from "src/utils/KakaoRequest.util";
import KakaoBotResponse, {
  BlockName,
  Button,
  CustomBoardItemData,
} from "src/response/KakaoBotResponse";
import { RoleName } from "../user/constant/Role";
import { AddAssignmentDTO, FindAssignmentDetailDTO, FindAssignmentListDTO } from "./dto";

class AssignmentController {
  private assignmentService = new AssignmentService();

  feature(req: Request, res: Response) {
    const {role} = req.body;
    
    const response = new KakaoBotResponse();
   
   response.addQuickReplie({
     label: "선생님 공지 확인하기",
     action: "block",
     blockId: BlockName.NOTIFICATION_LIST_CHECK
   })

   if (role === RoleName.TEACHER) {
     response.addQuickReplie({
       label: "선생님 공지 등록하기",
       action: "block",
       blockId: BlockName.NOTIFICATION_POST
     })
   }

    res.status(200).send(response.getData())
 }

  async findAssignmentList(req: Request, res: Response) {
    try {
      const { botUserKey } = req.body;
      const pageParam = req.body.extraParams.page;
      const page = pageParam ? pageParam : 1;

      const findAssignmentListDTO = new FindAssignmentListDTO(botUserKey, parseInt(page));
      const [assignmentList, isEndPage] = await this.assignmentService.findAssignmentList(
        findAssignmentListDTO
      );

      const header = `과목별 선생님 공지 (${page}페이지)`;
      const itemDataArray: CustomBoardItemData[] = assignmentList.map((assignment) => {
        const { id, title, teacher } = assignment;
        return {
          title: `{${id}} ${title}`,
          description: `${teacher.name} (${teacher.major})`,
          params: {
            assignmentId: id,
            page,
          },
        };
      });

      const response = new KakaoBotResponse();
      response.addCustomBoard(
        header,
        itemDataArray,
        BlockName.ASSIGNMENT_LIST_CHECK,
        BlockName.ASSIGNMENT_DETAIL_CHECK,
        page,
        isEndPage
      );
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }

  async findAssignmentDetail(req: Request, res: Response) {
    try {
      const { assignmentId, page } = req.body.extraParams;

      const findAssignmentDetailDTO = new FindAssignmentDetailDTO(parseInt(assignmentId));
      const assignmentDetail = await this.assignmentService.findAssignmentDetail(
        findAssignmentDetailDTO
      );

      const { title, article, teacher, imageUrlArray } = assignmentDetail;
      const textCardButtonArray: Button[] = [
        {
          label: "돌아가기",
          action: "block",
          blockId: BlockName.ASSIGNMENT_LIST_CHECK,
          extra: { page },
        },
      ];

      const response = new KakaoBotResponse();
      response.addTextCardOutput(title, `작성자 : ${teacher.name} (${teacher.major})\n\n${article}`, textCardButtonArray);
      imageUrlArray?.forEach((imageUrl) => {
        response.addSimpleImageOutput(
          imageUrl,
          "과목별 선생님 공지에 첨부된 이미지입니다."
        );
      });
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }

  async addAssignment(req: Request, res: Response) {
    try {
      const { botUserKey } = req.body;
      const { title, article, image } = req.body.params;
      const imageUrlArray: string[] | null = image
        ? KakaoRequestUtil.getSecureImageUrlArray(image)
        : null;

      const addAssignmentDTO = new AddAssignmentDTO(
        botUserKey,
        title,
        article,
        imageUrlArray
      );
      await this.assignmentService.addAssignment(addAssignmentDTO);

      const response = new KakaoBotResponse();
      response.addSimpleTextOutput("과목별 선생님 공지가 등록되었습니다!");
      res.status(200).send(response.getData());
    } catch (e) {
      console.log(e);
    }
  }
}

export default AssignmentController;
