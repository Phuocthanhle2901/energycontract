import { Component, OnInit  } from '@angular/core';
import {getCookie} from '../../../assets/js/auth';
import { Router } from '@angular/router';
import {TestService} from '../../Services/test.service';
import { UserAnswer } from 'src/app/Models/UserAnswer.model';
import axios from 'axios';

@Component({
  selector: 'app-detail-achievement',
  templateUrl: './detail-achievement.component.html',
  styleUrls: ['./detail-achievement.component.scss']
})
export class DetailAchievementComponent implements OnInit {

  show=true;  
  correct={
    display: "inline",
    color: 'green',
  }
  hiden={
    display: "inline",
  }
  fail={
    display: "inline",
    color:"#f11c14",
  }

  cookie:any;
  email:string;
  role:number;
  result:UserAnswer;
  id:string;
  constructor(private testService:TestService, private router: Router) { }

  ngOnInit(): void {
    this.cookie = getCookie();
    this.checkLogin();
  }

  checkLogin(){
    if(this.cookie.token!=undefined) //get user email
    {
      axios.post("https://localhost:44328/api/UserInfo/user?id="+ this.cookie.token)
      .then(res=>{
        this.email = res.data.result.email;
        this.role = res.data.result.role;

        let cutPost = window.location.href.indexOf('achievements/');
        this.id = window.location.href.substring(cutPost+13);
        this.result = new UserAnswer();
        this.getDetail(this.id);
      })
      .catch(err=>console.log(err));
    }
    else this.router.navigate(["/login"]);
  }
  
  getDetail(id:string){
    this.testService.getDetail(id).subscribe((res:any)=>{
      this.result = res;
      //redirect out if user is not owner of this result nor admin
      if(this.result.email!=this.email && this.role!=2) this.router.navigate(["/"]);
      console.log(this.result);
    })
  }

  viewAchievements(email:string){
    this.testService.setEmail(email);
    this.router.navigate(["/achievements"]);
   }
}
