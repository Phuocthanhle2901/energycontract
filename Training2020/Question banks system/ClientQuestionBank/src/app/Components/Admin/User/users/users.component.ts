import { Route } from '@angular/compiler/src/core';
import { Component, AfterContentInit, OnInit,SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import {UserService}from '../../../../Services/user.service';
import axios from "axios";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  r: string;
  list = [];
  searchUser=[];
  userOrAdmin = "";
  status :any[]=[];
  role:any[]=[];
  dataform:FormGroup;

  private listUser: BehaviorSubject<any> = new BehaviorSubject<any>({});
  listUser$: Observable<any> = this.listUser.asObservable(); // new data

  constructor(private router: Router,private userservice:UserService,private fb:FormBuilder) {
    this.dataform=this.fb.group({
      search:new FormControl(""),
    })
  }

  ngOnInit(): void {
    this.r = this.r = this.router.url.split('/')[3];
    // if(this.r =="ad"){
    //    axios.post("https://localhost:44328/api/UserInfo/user/admin")
    //     .then(res => {
    //       if (res.data != null) {
    //           this.list = res.data;
    //           res.data.forEach(e=>{
    //             this.status.push(e.status);
    //           });
    //       }
    //       else {}
    //     })
    //     .catch(err => console.log(err));
    // }else{
    //   axios.post("https://localhost:44328/api/UserInfo/user/user")
    //     .then(res => {
    //       if (res.data != null) {
    //           this.list = res.data;
    //       }
    //       else {}
    //     })
    //     .catch(err => console.log(err));
    // }
    this.getListUser();
    this.listUser$.subscribe((data:any)=>{
      this.list=data;
    })
    this.getRole();
  }



  SearchByName(value:any)
  {

     this.listUser$.subscribe((data:any)=>{
         this.searchUser=data;
     })
     this.list=[];
    this.searchUser.filter((res:any)=>{
      if(res.fullname.toLowerCase().indexOf(value.search)!=-1)
      {
        this.list.push(res);
      }
    })
  }

  removeUser(id:any){
      this.userservice.removeUser(id).subscribe((data:any) =>
       {this.userservice.removeUser(id)});

          this.getListUser();
          window.location.reload();
  }
  getListUser()
  {
    this.userservice.getAlluser().subscribe((data:any)=>{
      this.listUser.next(data)
      this.list=data;
    })
  }

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
 getUserById(id:any){
   this.userservice.getUserForUpdate(id).subscribe((data:any)=>{
     this.userservice.setuserObservable(data);
     this.router.navigate(["/admin/editUser"])
   })
 }

}
