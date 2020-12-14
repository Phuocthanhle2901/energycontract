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
  role:"";

  use=faUser;
  ngOnInit(): void {

    var cookie=getCookie();
    axios.post("https://localhost:44328/api/UserInfo/user?id="+cookie.token)
    .then(res=>{
      console.log(res.data)
        if(res.data!=null)
        {
          this.role=res.data.result.role;
          this.email=res.data.result.email;
        }
        else{
          this.role="";
          this.email="";
        }
    })
    .catch(err=>console.log(err));
  }
  userSignout()
  {

    signout();
    // window.location.reload();
  }








}
