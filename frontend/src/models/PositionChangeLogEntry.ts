export interface PositionChangeLogEntry {
  id: string;
  positionId: string;
  editedField: string;
  oldValue: string;
  newValue: string;
  editor: string;
  timestamp: string;
  decisionNumber: string;
}
