import apiClient from 'services/api-client';
import type { ChangeLogEntry } from 'models/ChangeLogEntry';

export const fetchAllChangeLogs = async (): Promise<ChangeLogEntry[]> => {
    const response = await apiClient.get('/changelogs');
    return response.data;
};
