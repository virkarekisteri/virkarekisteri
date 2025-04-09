export interface AdminChangeLogEntry {
  id: string;
  objectType: string;
  objectId: string;
  editedField: string;
  oldValue: string;
  newValue: string;
  editor: string;
  timestamp: string;
}
