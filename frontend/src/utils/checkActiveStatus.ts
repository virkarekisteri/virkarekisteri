import type { Subject } from "models/Subject";

export const checkActiveStatus = (subject: Subject | undefined, notActivePhrase: string): string => {
    const returnable = (subject && subject?.subjectName) ? 
    subject.active ? subject.subjectName : subject.subjectName+` (${notActivePhrase})`
    : ''
    return returnable
  };
