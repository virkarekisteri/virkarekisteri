export interface Position {
  id?: string;

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

  details?: string;

  placementLocation?: string;
}
