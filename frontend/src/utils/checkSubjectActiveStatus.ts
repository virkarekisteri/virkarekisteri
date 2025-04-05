import type { Subject } from "models/Subject";

export const checkSubjectActiveStatus = (subject: Subject | undefined, notActiveSuffix: string): string => {
    return (subject && subject?.subjectName) ? 
    subject.active ? subject.subjectName : subject.subjectName+` (${notActiveSuffix})`
    : ''
  };
