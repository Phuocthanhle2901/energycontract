import { Component, OnInit } from '@angular/core';
import{Router}from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  route:string;
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.route=this.router.url;
  }

}
