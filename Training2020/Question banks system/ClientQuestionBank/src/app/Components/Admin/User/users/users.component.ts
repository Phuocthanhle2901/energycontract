import { Route } from '@angular/compiler/src/core';
import { Component, AfterContentInit, OnInit,SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import {UserService}from '../../../../Services/user.service';
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
  role:any[]=[];

  constructor(private router: Router,private userservice:UserService) {
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
    this.getRole();
  }

  Sua(email){
  }

  removeUser(id:any){
    this.userservice.removeUser(id).subscribe((data:any) => {this.userservice.removeUser(id)});
    console.log(id);
  }
//   Xoa(email:string,i){
//     if(this.r == "us"){
//       email = email.replace('@',"%40");
//     axios.post("https://localhost:44328/api/UserInfo/user/disable_user?email="+email)
//         .then(res => {
//              this.status[i] = !this.status[i];
//         })
//         .catch(err => console.log(err));
//   }
//  }
  getColor(i){return this.status[i] ? 'green' : 'red';}
 getRole() // get all role in database/
 {
    this.userservice.getRole().subscribe((data:any)=>{
      this.role=data;
    })
 }
 getUserbyRole(role:any)
 {
   this.userservice.getUserbyRole(role).subscribe((data:any)=>{
     this.list=data;
   })
   console.log(this.list);
 }

 getAchievementById(id:any)
 {
 }
 getUserById(id:any){}

}
