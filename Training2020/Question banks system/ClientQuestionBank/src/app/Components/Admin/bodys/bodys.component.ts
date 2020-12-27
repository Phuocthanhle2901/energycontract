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

    if(this.router.url.split('/')[2]==='users')
    {
      this.routes=this.router.url.slice(0,12);
    }
   else if(this.router.url.split('/')[2]==='questions')
    {
      this.routes=this.router.url.slice(0,16);
    }
    else{
      this.routes=this.router.url;
    }
  }

}
