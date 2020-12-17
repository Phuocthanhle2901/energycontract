import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {getCookie,signout} from '../../../assets/js/auth.js';
import axios from "axios";
@Component({
  selector: 'app-haeder',
  templateUrl: './haeder.component.html',
  styleUrls: ['./haeder.component.scss']
})
export class HaederComponent implements OnInit {

  constructor(private router:ActivatedRoute) { }
  email:string;
  role:any='';
  ten:string;

  use=faUser;
  ngOnInit(): void {

    var cookie=getCookie();
    if(cookie.token!=undefined)
    {
      axios.post("https://localhost:44328/api/UserInfo/user?id="+cookie.token)
      .then(res=>{

          if(res.data!=null)
          {
            console.log(res.data);
            this.role =res.data.result.role;
            this.email=res.data.result.email;
            this.ten = res.data.result.fullname
          }
          else{
            this.role=false;
            this.email="";
          }
      })
      .catch(err=>console.log(err));

    }

  }
  userSignout()
  {
    signout();
     window.location.reload();
  }








}
