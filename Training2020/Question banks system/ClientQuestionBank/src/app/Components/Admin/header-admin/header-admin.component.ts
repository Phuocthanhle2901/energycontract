import { Component, OnInit } from '@angular/core';
import axios from "axios";
import {Router} from '@angular/router';
import{getCookie,signout}from '../../../../assets/js/auth.js';
@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit {


  email:string;
  role:any='';
  ten:string;

  constructor(private router:Router) { }

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
          if(this.role!=2) this.router.navigate(["/"]);
      })
      .catch(err=>console.log(err));
    }
    else this.router.navigate(['/']);
  }
  userSignout()
  {
    signout();
    this.router.navigate(["/"]);

  }

}
