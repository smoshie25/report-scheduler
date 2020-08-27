export interface Schedule {
    id: string;
    name: string;
    frequency: any[];
    file: string[];
    active : boolean;
    time: string;
    date: string;
    description: string;
    recipients: string[];
    scheduleType: string;
  }