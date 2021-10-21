import { User } from "./user";

export class EventCalendar{

    id: number;
    userId: number;
    user: User;
    description: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    dateInserted: Date;
    dateUpdated: Date;
    active: boolean;
}