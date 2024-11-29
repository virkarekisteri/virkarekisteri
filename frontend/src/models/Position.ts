import type { PositionName } from './PositionName';

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

  positionName: PositionName;

  details?: string;

  placementLocation?: string;

  positionEmployeeId?: string;

  orgTreeId: string;

  vacancyStatus: number;

  decisionNumber?: string;
}
