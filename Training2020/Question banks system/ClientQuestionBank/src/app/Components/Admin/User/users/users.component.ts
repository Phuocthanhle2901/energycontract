import { Route } from '@angular/compiler/src/core';
import { Component, AfterContentInit, OnInit,SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import axios from "axios";


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  r: string;
  list = [];
  userOrAdmin = "";
  status :any[]=[];

  constructor(private router: Router) {
    console.log(this.router.url.split('/')[3])
  }
  
  ngOnInit(): void {
    this.r = this.r = this.router.url.split('/')[3];
    if(this.r =="ad"){
       axios.post("https://localhost:44328/api/UserInfo/user/admin")
        .then(res => {
          if (res.data != null) {
              this.list = res.data;
              res.data.forEach(e=>{
                this.status.push(e.status);
              });
          }
          else {}
        })
        .catch(err => console.log(err));
    }else{
      axios.post("https://localhost:44328/api/UserInfo/user/user")
        .then(res => {
          if (res.data != null) {
              this.list = res.data;
          }
          else {}
        })
        .catch(err => console.log(err));
    }
  }

  Sua(email){

  }
  Xoa(email:string,i){
    if(this.r == "us"){
      email = email.replace('@',"%40");
    axios.post("https://localhost:44328/api/UserInfo/user/disable_user?email="+email)
        .then(res => {
             this.status[i] = !this.status[i];
        })
        .catch(err => console.log(err));
  }
 }
    
  getColor(i){return this.status[i] ? 'green' : 'red';}
 
}
