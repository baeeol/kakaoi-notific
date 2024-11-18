import ServiceException from "@exception/Service.exception";
import AssignmentRepository from "./Assignment.repository";
import ImageFileService, { DirNameType } from "src/image/ImageFile.service";
import UserRepository from "../user/User.repository";
import { AddAssignmentDTO, FindAssignmentDetailDTO, FindAssignmentListDTO } from "./dto";
import Assignment from "./entity/Assignment.entity";

export type assignmentListItem = {
  id: number;
  title: string;
  teacher: {name: string, major: string}
};

export type assignmentDetail = {
  title: string;
  article: string;
  teacher: {name: string, major: string},
  imageUrlArray: string[] | null;
};

class AssignmentService {
  private assignmentRepository = new AssignmentRepository();
  private imageFileService = new ImageFileService();
  private userRepository = new UserRepository();

  async findAssignmentList(
    findAssignmentListDTO: FindAssignmentListDTO
  ): Promise<[assignmentListItem[], boolean]> {
    try {
      const { botUserKey, page } = findAssignmentListDTO;
      const ASSIGNMENT_LIST_SIZE = 5;

      const user = await this.userRepository.findStudentByKakaoUserId(botUserKey);
      if (!user) {
        throw new ServiceException(`user bot user key ${botUserKey} is not exist`);
      }
      const course = JSON.parse(user.course);

      const [assignmentEntityArray] = await this.assignmentRepository.findWithPaginationJoinTeacherFileterCourse(
        ASSIGNMENT_LIST_SIZE,
        page, course
      );

      const assignmentArray = assignmentEntityArray.map((assignmentEntity) => {
        const { id, title, teacher } = assignmentEntity;

        // 글자 길이 조정
        const TITLE_LENGTH_LIMIT = 30;
        let assignmentTitle = title;
        if (title.length > TITLE_LENGTH_LIMIT) {
          assignmentTitle = title.substring(0, TITLE_LENGTH_LIMIT - 3).concat("...");
        }

        return { id, title: assignmentTitle, teacher: {name: teacher.name, major: teacher.major} };
      });

      // 마지막 페이지인지 체크
      let isEndPage = false;
      const [nextPageAssignmentArray] =
        await this.assignmentRepository.findWithPaginationJoinTeacherFileterCourse(
          ASSIGNMENT_LIST_SIZE,
          page + 1,
          course
        );
      if (
        assignmentArray.length < ASSIGNMENT_LIST_SIZE ||
        nextPageAssignmentArray.length === 0
      ) {
        isEndPage = true;
      }

      return [assignmentArray, isEndPage];
    } catch (e) {
      throw e;
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

      const { title, article, teacher, image_dir } = assignmentEntity;
      let imageUrlArray = null;
      if (image_dir) {
        imageUrlArray = this.imageFileService.getAllImageUrl(image_dir as DirNameType);
      }
      const assignmentDetail = { title, article, teacher: {name: teacher.name, major: teacher.major}, imageUrlArray };

      return assignmentDetail;
    } catch (e) {
      throw e;
    }
  }

  async addAssignment(addAssignmentDTO: AddAssignmentDTO) {
    try {
      const { botUserKey, title, article, imageUrlArray } = addAssignmentDTO;

      const teacher = await this.userRepository.findTeacherByKakaoUserId(botUserKey);
      if (!teacher) {
        throw new ServiceException(`teacher bot user key ${botUserKey} is not exist`);
      }

      const imageDirName = imageUrlArray
        ? await this.imageFileService.saveImageInRandomDir(imageUrlArray)
        : null;

      const assignment = new Assignment(title, article, teacher, imageDirName);
      await this.assignmentRepository.create(assignment);
    } catch (e) {
      throw e;
    }
  }
}

export default AssignmentService;
