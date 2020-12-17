import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navleft',
  templateUrl: './navleft.component.html',
  styleUrls: ['./navleft.component.scss']
})
export class NavleftComponent implements OnInit {

  constructor(private router: Router ) { }

  ngOnInit(): void {
  }
  
  onClickUserOrAdmin(s){
    this.router.navigate(["/admin/users/"+s]);
  }

}

