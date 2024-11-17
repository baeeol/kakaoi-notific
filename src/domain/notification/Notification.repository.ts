import Database from "@config/Database";
import Notification from "./entity/Notification.entity";

class NotificationRepository {
  private notificationRepository = Database.getRepository(Notification);

  async create(notification: Notification): Promise<Notification | null> {
    return await this.notificationRepository.save(notification);
  }

  async findById(id: number): Promise<Notification | null> {
    return await this.notificationRepository.findOne({ where: { id } });
  }

  async findWithPagination(
    size: number,
    page: number
  ): Promise<[Notification[], number]> {
    return await this.notificationRepository.findAndCount({
      take: size,
      skip: (page - 1) * size,
      order: { id: "DESC" },
    });
  }
}

export default NotificationRepository;
