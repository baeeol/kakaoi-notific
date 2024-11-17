import { DataSource } from "typeorm";

export default new DataSource({
  type: "sqlite",
  database: "db.db",
  synchronize: true,
  logging: true,
  entities: ["src/**/*.entity.ts"],
});
