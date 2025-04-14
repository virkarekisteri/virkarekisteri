export interface Position {
  id?: string;

  vacancyNumber?: string;

  createdAt: Date;

  endedAt?: Date;

  vacancySize?: number;

  vacancyFill?: number;

  pricingId?: string;

  creationDecisionNumber: string;

  endingDecisionNumber?: string;

  type: number;

  educationLevel?: string;

  workExperience?: string;

  positionNameId: string;

  details?: string;

  placementLocation?: string;

  positionEmployeeId?: string;

  replacementEmployeeId?: string;

  costcentreId: string;

  vacancyStatus: number;

  employeeName?: string;

  employeeStartDate?: string;

  employeeEndDate?: string;

  replacementName?: string;

  replacementStartDate?: string;

  replacementEndDate?: string;

  isTeacher?: boolean;

  subjectIds?: string[];
}
