import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("notification")
export default class Notification {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 50, nullable: false })
  title: string;

  @Column("varchar", { length: 400, nullable: false })
  article: string;

  @Column("varchar", { length: 40, nullable: true, unique: true })
  image_dir: string | null;

  constructor(title: string, article: string, image_dir: string | null) {
    this.title = title;
    this.article = article;
    this.image_dir = image_dir;
  }
}
