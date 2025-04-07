import type { TeacherSubject } from 'models/TeacherSubject';

export const checkSubjectActiveStatus = (subject: TeacherSubject | undefined, notActiveSuffix: string): string => {
  return subject && subject?.subjectName
    ? subject.active
      ? subject.subjectName
      : subject.subjectName + ` (${notActiveSuffix})`
    : '';
};
