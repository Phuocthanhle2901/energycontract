import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bodys',
  templateUrl: './bodys.component.html',
  styleUrls: ['./bodys.component.scss']
})
export class BodysComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() themeName:string;

  routes:string='';
  ngOnInit(): void {
      this.routes=this.router.url;
  }

}
