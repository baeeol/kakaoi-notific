export const RoleName = {
  STUDENT: "S",
  TEACHER: "T",
};
export type RoleType = (typeof RoleName)[keyof typeof RoleName];
