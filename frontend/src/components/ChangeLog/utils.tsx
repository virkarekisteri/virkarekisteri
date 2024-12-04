import { format } from 'date-fns';

export const formatTimestamp = (timestamp: string): string => {
    return format(new Date(timestamp), 'dd.MM.yyyy HH:mm:ss');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getVacancyNumber = (positionId: string, positions: any[]): string => {
    const position = positions.find((pos) => pos.id === positionId);
    return position?.vacancyNumber || '-';
};
