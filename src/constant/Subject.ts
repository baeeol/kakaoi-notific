export const SubjectName = {
  LANGUAGE_AND_MEDIA: "언어와 매체",
  MATH1: "수학I",
  MATH2: "수학II",
  ENGLISH1: "영어I",
  ENGLISH2: "영어II",
  GEOMETRY: "기하",
  PROBABILITY_AND_STATISTICS: "확률과 통계",
  JAPANESE1: "일본어I",
  CHINESE1: "중국어I",
  PHYSICS1: "물리학I",
  PHYSICS2: "물리학II",
  CHEMISTRY1: "화학I",
  CHEMISTRY2: "화학II",
  BIOLOGY1: "생명과학I",
  BIOLOGY2: "생명과학II",
  EARTH_SCIENCE1: "지구과학I",
  EARTH_SCIENCE2: "지구과학II",
  ART: "미술",
  MUSIC: "음악",
  UNIFIED_SCIENCE: "통합과학",
};
export type SubjectType = (typeof SubjectName)[keyof typeof SubjectName];
export const LIST_OF_SUBJECT = Object.values(SubjectName);
