import Database from "@config/Database";
import Assignment from "./entity/Assignment.entity";
import { SubjectType } from "src/constant/Subject";

class AssignmentRepository {
  private assignmentRepository = Database.getRepository(Assignment);

  async create(assignment: Assignment): Promise<Assignment | null> {
    return await this.assignmentRepository.save(assignment);
  }

  async findById(id: number): Promise<Assignment | null> {
    return await this.assignmentRepository.findOne({ where: { id } });
  }

  async findWithPaginationJoinTeacher(size: number, page: number): Promise<[Assignment[], number]> {
    return await this.assignmentRepository.findAndCount({
      take: size,
      skip: (page - 1) * size,
      order: { id: "DESC" },
      relations: ["teacher"]
    });
  }

  async findWithPaginationJoinTeacherFileterCourse(size: number, page: number, course: SubjectType[]): Promise<[Assignment[], number]> {
    const [allAssignmentJoinTeacher, count] = await this.findWithPaginationJoinTeacher(size, page);
    
    return [allAssignmentJoinTeacher.filter((assignment) => {
      return course.includes(assignment.teacher.major);
    }), count]
  }
}

export default AssignmentRepository;
