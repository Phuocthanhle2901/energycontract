import { Route } from '@angular/compiler/src/core';
import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  route:string;
  constructor( private router:Router) {

   }


  ngOnInit(): void {
    this.route=this.router.url.split('/')[3];
    console.log(this.route)
  }

}
