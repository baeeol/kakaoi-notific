import ServiceException from "@exception/Service.exception";
import AssignmentRepository from "./Assignment.repository";
import ImageFileService, { DirNameType } from "src/image/ImageFile.service";
import { AddAssignmentDTO, FindAssignmentDetailDTO, FindAssignmentListDTO } from "./dto";
import Assignment from "./entity/Assignment.entity";

export type assignmentListItem = {
  id: number;
  title: string;
};

export type assignmentDetail = {
  title: string;
  article: string;
  subject: string;
  imageUrlArray: string[] | null;
};

class AssignmentService {
  private assignmentRepository = new AssignmentRepository();
  private imageFileService = new ImageFileService();

  async findAssignmentList(
    findAssignmentListDTO: FindAssignmentListDTO
  ): Promise<[assignmentListItem[], boolean]> {
    try {
      const { page } = findAssignmentListDTO;
      const ASSIGNMENT_LIST_SIZE = 5;

      const [assignmentEntityArray] = await this.assignmentRepository.findWithPagination(
        ASSIGNMENT_LIST_SIZE,
        page
      );

      const assignmentArray = assignmentEntityArray.map((assignmentEntity) => {
        const { id, title } = assignmentEntity;

        // 글자 길이 조정
        const TITLE_LENGTH_LIMIT = 30;
        let assignmentTitle = title;
        if (title.length > TITLE_LENGTH_LIMIT) {
          assignmentTitle = title.substring(0, TITLE_LENGTH_LIMIT - 3).concat("...");
        }

        return { id, title: assignmentTitle };
      });

      // 마지막 페이지인지 체크
      let isEndPage = false;
      const [nextPageAssignmentArray] =
        await this.assignmentRepository.findWithPagination(
          ASSIGNMENT_LIST_SIZE,
          page + 1
        );
      if (
        assignmentArray.length < ASSIGNMENT_LIST_SIZE ||
        nextPageAssignmentArray.length === 0
      ) {
        isEndPage = true;
      }

      return [assignmentArray, isEndPage];
    } catch (e) {
      throw new ServiceException(`예상치 못한 오류가 발생하였습니다. ${e}`);
    }
  }

  async findAssignmentDetail(
    findAssignmentDetailDTO: FindAssignmentDetailDTO
  ): Promise<assignmentDetail> {
    try {
      const { id } = findAssignmentDetailDTO;

      const assignmentEntity = await this.assignmentRepository.findById(id);
      if (!assignmentEntity) {
        throw new ServiceException(`assignment id ${id} is not exist`);
      }

      const { title, article, subject, image_dir } = assignmentEntity;
      let imageUrlArray = null;
      if (image_dir) {
        imageUrlArray = this.imageFileService.getAllImageUrl(image_dir as DirNameType);
      }
      const assignmentDetail = { title, article, subject, imageUrlArray };

      return assignmentDetail;
    } catch (e) {
      throw e;
    }
  }

  async addAssignment(addAssignmentDTO: AddAssignmentDTO) {
    try {
      const { title, article, subject, imageUrlArray } = addAssignmentDTO;

      const imageDirName = imageUrlArray
        ? await this.imageFileService.saveImageInRandomDir(imageUrlArray)
        : null;

      const assignment = new Assignment(title, article, subject, imageDirName);
      await this.assignmentRepository.create(assignment);
    } catch (e) {
      throw new ServiceException(`예상치 못한 오류가 발생하엿습니다. ${e}`);
    }
  }
}

export default AssignmentService;
