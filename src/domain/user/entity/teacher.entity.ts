import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from "../constant/Role";
import { SubjectType } from "src/constant/Subject";
import Assignment from "src/domain/assignment/entity/Assignment.entity";

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

  @Column("varchar", { length: 10, nullable: false })
  major: SubjectType;

  @Column("varchar", { length: 1, nullable: false })
  role: RoleType;

  @OneToMany(() => Assignment, (assignment) => assignment.teacher)
  assignment!: Assignment[];

  constructor(name: string, password: string, major: SubjectType, role: RoleType) {
    this.name = name;
    this.password = password;
    this.major = major;
    this.role = role;
  }
}
