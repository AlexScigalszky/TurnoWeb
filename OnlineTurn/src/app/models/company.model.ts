export class BusinnessHour{
  from: string;
  to: string;
}

export class Company {
  id: string;
  name: string;
  address: string;
  current: number;
  next: number;
  date: any;
  userId: string;
  timeOfTurns:number;// minutes
  tradeHourFromOne:Date;
  tradeHourFromTwo: Date;
  tradeHourToOne: Date;
  tradeHourToTwo: Date;
  enabled: boolean;
  notes: string;
  weekdays: number[];
  businessHours: BusinnessHour[];
}
