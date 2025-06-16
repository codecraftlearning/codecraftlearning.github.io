import { BatchStatus, WeekDays } from "../constants/commons.enum";

export interface IBatch {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    strength?: number;
    status: BatchStatus;
    instructorName: string;
    weeklySchedule: {
        day: WeekDays; 
        startTime: string; 
        endTime: string; 
    }[];
    createdAt: Date;
    updatedAt: Date;
    description?: string; 
}