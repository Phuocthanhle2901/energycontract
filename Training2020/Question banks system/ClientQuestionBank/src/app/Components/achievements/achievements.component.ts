import { Component, OnInit } from '@angular/core';
import { UserAnswer } from 'src/app/Models/UserAnswer.model';
import {TestService} from '../../Services/test.service';
import {getCookie} from '../../../assets/js/auth';
import { Router } from '@angular/router';
import axios from 'axios';
@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit {

  cookie:any;
  email:string;
  testResults:UserAnswer[] = [];
  pageCount:number;
  currentPage:number;
  constructor(private testService:TestService, private router: Router) { }

  ngOnInit(): void {
    this.cookie = getCookie();
    this.checkLogin();
  }

  getResults(email:string, page:number){
    this.testService.getResults(email, page).subscribe((res:any)=>{
      this.testResults = res;
      this.currentPage = page;
    })
  }

  getPageCount(){
    this.testService.getResultCount(this.email).subscribe((res:any)=>{
      this.pageCount = res; //get question count
      this.pageCount = Math.ceil(this.pageCount/5); // 5 results per page
    })
  }

  checkLogin(){
    if(this.cookie.token!=undefined) //get user email
    {
      axios.post("https://localhost:44328/api/UserInfo/user?id="+ this.cookie.token)
      .then(res=>{
        console.log(this.testService.getEmail());
          //if navigated from manager page, serive mail will not be null
          if(this.testService.getEmail()!=undefined && res.data.result.role==2) this.email = this.testService.getEmail();
          else this.email = res.data.result.email; //if not, service will return user result using login email
          this.getResults(this.email, 0); 
          this.getPageCount();
      })
      .catch(err=>console.log(err));
    }
    else this.router.navigate(["/login"]);
  }

}
