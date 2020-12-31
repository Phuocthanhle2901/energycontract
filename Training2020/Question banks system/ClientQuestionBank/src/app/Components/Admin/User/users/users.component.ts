import { Route } from '@angular/compiler/src/core';
import { Component, AfterContentInit, OnInit,SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import {UserService}from '../../../../Services/user.service';
import {TestService}from '../../../../Services/test.service';
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

  constructor(private router: Router,private userservice:UserService,private fb:FormBuilder, private testService:TestService) {
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

  Sua(email){
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

    var confirmText = "Are you sure you want to delete this Account?";
    if(confirm(confirmText)) {
      this.userservice.removeUser(id).subscribe((data:any) => {this.userservice.removeUser(id)});
          alert("delete user success")
          this.getListUser();
   }else{
      return false;
   }




  }
  getListUser()
  {
    this.userservice.getAlluser().subscribe((data:any)=>{
      this.listUser.next(data)
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

 getUserById(id:any){
   this.userservice.getUserForUpdate(id).subscribe((data:any)=>{
     this.userservice.setuserObservable(data);
     this.router.navigate(["/admin/editUser"])
   })
 }

 viewAchievements(email:string){
  this.testService.setEmail(email);
  this.router.navigate(["/achievements"]);
 }

}
