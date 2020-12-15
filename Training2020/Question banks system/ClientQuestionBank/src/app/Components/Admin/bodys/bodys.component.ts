import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bodys',
  templateUrl: './bodys.component.html',
  styleUrls: ['./bodys.component.scss']
})
export class BodysComponent implements OnInit {

  constructor(private router: Router) { }
  routes:string;
  ngOnInit(): void {
    this.routes=this.router.url;
    console.log(this.routes)
  }

}
