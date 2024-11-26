export interface PositionEmployee {
  id: string;
  startDate: Date;
  endingDate?: Date;
  positionId: string;
  employeeName: string;
  email?: string;
  replacement?: boolean;
  inLeave?: boolean;
}
