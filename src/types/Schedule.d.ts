export type ScheduleHours = {
  open: string;
  close: string;
  type?: string;
};

export type ScheduleInfo = {
  regular: ScheduleHours | null;
  additional: ScheduleHours[];
};