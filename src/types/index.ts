export interface Task {
    id: number;
    text: string;
    completed: boolean;
    date: Date;
    category: string;
}

export interface DayInfo {
    dayName: string;
    dayNumber: number;
    date: Date;
    isToday: boolean;
}
