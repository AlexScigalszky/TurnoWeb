import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "weekdaysNumberToString",
})
export class WeekdaysNumberToStringPipe implements PipeTransform {
  transform(value: number[], ...args: unknown[]): unknown {
    return value.map((x) => this.toChar(x)).join("-");
  }

  toChar(day: number) {
    switch (day) {
      case 0:
        return "L";
      case 1:
        return "Ma";
      case 2:
        return "Mi";
      case 3:
        return "J";
      case 4:
        return "V";
      case 5:
        return "S";
      case 6:
        return "D";
      default:
        return day + "";
    }
  }
}
