import { Teacher } from "src/domain/user/entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("assignment")
export default class Assignment {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 50, nullable: false })
  title: string;

  @Column("varchar", { length: 400, nullable: false })
  article: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.assignment)
  teacher: Teacher;

  @Column("varchar", { length: 40, nullable: true, unique: true })
  image_dir: string | null;

  constructor(title: string, article: string, teacher: Teacher, image_dir: string | null) {
    this.title = title;
    this.article = article;
    this.teacher = teacher
    this.image_dir = image_dir;
  }
}
