import type { PositionName } from './PositionName';

export interface Position {
  id?: string;

  createdAt: Date;

  endedAt?: Date;

  vacancySize?: number;

  vacancyFill?: number;

  creationDecisionNumber: string;

  endingDecisionNumber?: string;

  type: number;

  educationLevel?: string;

  workExperience?: string;

  positionName: PositionName;

  details?: string;

  placementLocation?: string;
}
