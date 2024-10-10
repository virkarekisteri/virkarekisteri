export interface Position {
  id?: string;

  createdAt: Date;

  endedAt?: Date;

  vacancySize?: number;

  vacancyFill?: number;

  creationDecisionNumber: string;

  endingDecisionNumber?: string;

  type: number;
}
