import { Component, Input } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  public isMenuCollapsed = true;
  @Input()
  user: User;
  constructor(private afAuth: AngularFireAuth) {}

  logout() {
    this.afAuth.signOut();
  }
}
