import { Component, Input, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bodys',
  templateUrl: './bodys.component.html',
  styleUrls: ['./bodys.component.scss']
})
export class BodysComponent implements OnInit {

  constructor(private router: Router,private routerAction:ActivatedRoute) { }

  @Input() themeName:string;

  routes:string='';
  params="";
  ngOnInit(): void {

    if(this.router.url.split('/')[2]==='users')
    {
      this.routes=this.router.url.slice(0,12);
    }
   else if(this.router.url.split('/')[2]==='questions')
    {
      this.routes=this.router.url.slice(0,16);

      this.routerAction.queryParams
      .subscribe(params => {
        console.log(params)
      });
     console.log(this.params);
    }
    else{
      this.routes=this.router.url;
    }


  }

}
