import { Component, OnInit, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  model = {
    email: null,
    password: null,
    confirmPassword: null
  };
  errorMessage: string = null;
  isLoging: boolean = true;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.afAuth.user.subscribe((user) => {
      if (user) {
        this.ngZone.run(() => this.router.navigate(["/"]));
      }
    });
  }

  createUser() {
    if (this.model.password !== this.model.confirmPassword) {
      this.errorMessage = "Las contraseñas deben coincidir";
      return;
    }
    this.afAuth
      .createUserWithEmailAndPassword(this.model.email, this.model.password)
      .then(() => this.router.navigate(["/"]))
      .catch((response) => (this.errorMessage = response.message));
  }

  signIn() {
    this.afAuth
      .signInWithEmailAndPassword(this.model.email, this.model.password)
      .then(() => this.router.navigate(["/"]))
      .catch((response) => (this.errorMessage = response.message));
  }

  toggleLoging(){
    this.isLoging = !this.isLoging;
  }

}
