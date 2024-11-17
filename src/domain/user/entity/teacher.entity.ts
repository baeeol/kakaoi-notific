import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from "../constant/Role";
import { SubjectType } from "src/constant/Subject";

@Entity("teacher")
export default class Teacher {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("varchar", { length: 66, nullable: true, unique: true })
  kakao_user_id!: string | null;

  @Column("varchar", { length: 10, nullable: false })
  name: string;

  @Column("varchar", { length: 128, nullable: false })
  password: string;

  @Column("varchar", { length: 10, nullable: true })
  major!: SubjectType;

  @Column("varchar", { length: 1, nullable: false })
  role: RoleType;

  constructor(name: string, password: string, role: RoleType) {
    this.name = name;
    this.password = password;
    this.role = role;
  }
}
