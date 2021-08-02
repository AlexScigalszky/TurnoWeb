import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Company, BusinnessHour } from "../models/company.model";
import * as firebase from "firebase";
import { DatePipe } from "@angular/common";
import { AngularFireAuth } from "@angular/fire/auth";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CompaniesService {
  static readonly FORMAT_DATE = "yyyyMMdd";
  user: firebase.User;
  businessHoursDefault: BusinnessHour[] = [
    {
      from: "08:00",
      to: "12:00",
    },
    {
      from: "16:00",
      to: "20:00",
    },
  ];
  weekdaysDefault: number[] = [0, 1, 2, 3, 4];
  timeOfTurnsDefault: number = 15;

  constructor(
    private firestore: AngularFirestore,
    private datePipe: DatePipe,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.user.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  isOpen(model: Company): boolean {
    if (!model.weekdays){
      model = this.setDefaultWeekDays(model);
    }
    if (this.isOpenDay(model.weekdays)) {
      if (!model.businessHours) {
        model = this.setDefaultBusinessHours(model);
      }
      for (let i = 0; i < model.businessHours.length; i++) {
        const hour = model.businessHours[i];
        if (this.isInWorkingTime(hour)) {
          return true;
        }
      }
    }
    return false;
  }

  isOpenDay(weekdays: number[]): boolean {
    const now = new Date();
    return weekdays.indexOf(now.getDay()) > -1;
  }

  isInWorkingTime(businnessHour: BusinnessHour) {
    const now = new Date();

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const beginMinutes = this.toMinutes(businnessHour.from);
    const endMinutes = this.toMinutes(businnessHour.to);

    return beginMinutes <= nowMinutes && nowMinutes < endMinutes;
  }

  toMinutes(hourMinutes: string) {
    const array = hourMinutes.split(":");
    return parseInt(array[0], 10) * 60 + parseInt(array[1], 10);
  }

  toDate(fecha: any) {
    if (fecha instanceof Date) return fecha;
    return fecha.toDate();
  }

  getCompanies() {
    return this.firestore.collection("companies").snapshotChanges();
  }

  createCompany(
    company: Company | Partial<Company>
  ): Promise<DocumentReference> {
    company.date = firebase.firestore.FieldValue.serverTimestamp();
    company.current = 1;
    company.next = 1;
    company.userId = this.user.uid;
    return this.firestore.collection("companies").add(company);
  }

  updateCompany(company: Company): Promise<void> {
    // delete company.id;
    return this.firestore.doc("companies/" + company.id).update(company);
  }

  deleteCompany(companyId: string) {
    this.firestore.doc("companies/" + companyId).delete();
  }

  getCompany(companyId: string) {
    var obser = this.firestore
      .collection("companies")
      .doc(companyId)
      .valueChanges();
    return this.completeMissingDataWithDefaultValues(obser);
  }

  completeMissingDataWithDefaultValues(obser: Observable<any>) {
    return obser.pipe(
      map((x) => x as Company),
      map((x: Company) => this.setDefaultBusinessHours(x)),
      map((x: Company) => this.setDefaultWeekDays(x)),
      map((x: Company) => this.resetCurrentNextValuesIfIsNecesary(x)),
      map((x: Company) => this.setDefaultTimeOfTurns(x))
    );
  }

  public setDefaultBusinessHours(x: Company) {
    if (!x.businessHours) {
      x.businessHours = this.businessHoursDefault;
    }
    return x;
  }

  public setDefaultWeekDays(x: Company) {
    if (!x.weekdays) {
      x.weekdays = this.weekdaysDefault;
    }
    return x;
  }

  public resetCurrentNextValuesIfIsNecesary(x: Company) {
    const isOtherDay =
      this.datePipe.transform(
        this.toDate(x.date),
        CompaniesService.FORMAT_DATE
      ) !==
      this.datePipe.transform(
        this.toDate(new Date()),
        CompaniesService.FORMAT_DATE
      );
    if (!isOtherDay) {
      x.current = 1;
      x.next = 1;
      x.date = firebase.firestore.FieldValue.serverTimestamp();
    }
    return x;
  }

  public setDefaultTimeOfTurns(x: Company) {
    if (!x.timeOfTurns) {
      x.timeOfTurns = this.timeOfTurnsDefault;
    }
    return x;
  }

  nextTicket(companyId: string): Promise<number> {
    return this.firestore.firestore.runTransaction((transaction) => {
      let documentRef = this.firestore.firestore.doc("companies/" + companyId);
      return transaction.get(documentRef).then((doc) => {
        if (doc.exists) {
          let current: number = doc.get("current") || 1;
          transaction.update(documentRef, { current: ++current });
          return Promise.resolve(current);
        }
        transaction.set(documentRef, { count: 1 });
        return Promise.resolve(-1);
      });
    });
  }

  takeTicket(companyId: string): Promise<number> {
    return this.firestore.firestore.runTransaction((transaction) => {
      let documentRef = this.firestore.firestore.doc("companies/" + companyId);
      return transaction.get(documentRef).then((doc) => {
        if (doc.exists) {
          let next: number = doc.get("next") || 1;
          transaction.update(documentRef, { next: ++next });
          return Promise.resolve(next);
        }
        transaction.set(documentRef, { count: 1 });
        return Promise.resolve(-1);
      });
    });
  }

  generateCode(number: number, date: any): string {
    const monthOfYear = this.toDate(date).getMonth();
    const dayOfMoth = this.toDate(date).getDate();
    let dateStr = "";
    dateStr += this.convertNumberToChar(dayOfMoth);
    dateStr += number
      .toString()
      .split("")
      .map(String)
      .map((x) => this.convertNumberToChar(x))
      .join("");
    dateStr += "-";
    dateStr += (monthOfYear + number).toString(16);

    return dateStr.toUpperCase();
  }

  convertNumberToChar(number): string {
    switch (number) {
      case 1:
        return "b";
      case 2:
        return "h";
      case 3:
        return "1";
      case 4:
        return "y";
      case 5:
        return "5";
      case 6:
        return "c";
      case 7:
        return "k";
      case 8:
        return "g";
      case 9:
        return "l";
      case 10:
        return "m";
      case 11:
        return "9";
      case 12:
        return "o";
      case 13:
        return "u";
      case 14:
        return "f";
      case 15:
        return "i";
      case 16:
        return "x";
      case 17:
        return "q";
      case 18:
        return "7";
      case 19:
        return "a";
      case 20:
        return "e";
      case 21:
        return "2";
      case 22:
        return "3";
      case 23:
        return "n";
      case 24:
        return "s";
      case 25:
        return "ñ";
      case 26:
        return "p";
      case 27:
        return "w";
      case 28:
        return "4";
      case 29:
        return "d";
      case 30:
        return "j";
      case 31:
        return "r";
      default:
        return "" + number;
    }
  }

  getTextForTurnTime(model: Company): string {
    if (!model.timeOfTurns) return null;

    const hours = Math.floor(model.timeOfTurns / 60);
    const minutes = model.timeOfTurns % 60;

    let timeOfTurns = "Cada turno dura ";
    if (hours > 0) timeOfTurns += hours + " horas ";
    if (minutes > 0) timeOfTurns += minutes + " minutos";

    return timeOfTurns;
  }
}
