import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  public credential;
  constructor(
    private router: Router
  ) {
    this.credential = JSON.parse(sessionStorage.getItem("Credential"));
  }

  ngOnInit() {
  }

  public logOut() {
    sessionStorage.clear();
    this.router.navigate(["login"]);
  }

}
