import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from "../constant/Role";

@Entity("student")
export default class Student {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 66, nullable: true, unique: true })
  kakao_user_id!: string | null;

  @Column("varchar", { length: 5, nullable: false, unique: true })
  student_id: string;

  @Column("varchar", { length: 128, nullable: false })
  password: string;

  @Column("varchar", { length: 200, nullable: false, default: "[]" })
  course!: string;

  @Column("varchar", { length: 1, nullable: false })
  role: RoleType;

  constructor(student_id: string, password: string, role: RoleType) {
    this.student_id = student_id;
    this.password = password;
    this.role = role;
  }
}
