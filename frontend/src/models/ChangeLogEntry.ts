export interface ChangeLogEntry {
    id: string;
    positionId: string;
    editedField: string;
    oldValue: string;
    newValue: string;
    editor: string;
}
