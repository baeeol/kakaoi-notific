import Database from "@config/Database";
import Assignment from "./entity/Assignment.entity";

class AssignmentRepository {
  private assignmentRepository = Database.getRepository(Assignment);

  async create(assignment: Assignment): Promise<Assignment | null> {
    return await this.assignmentRepository.save(assignment);
  }

  async findById(id: number): Promise<Assignment | null> {
    return await this.assignmentRepository.findOne({ where: { id } });
  }

  async findWithPagination(size: number, page: number): Promise<[Assignment[], number]> {
    return await this.assignmentRepository.findAndCount({
      take: size,
      skip: (page - 1) * size,
      order: { id: "DESC" },
    });
  }
}

export default AssignmentRepository;
