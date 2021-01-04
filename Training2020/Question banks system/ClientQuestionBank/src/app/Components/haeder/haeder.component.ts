import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {getCookie,signout} from '../../../assets/js/auth.js';
import {ThemesService} from '../../Services/themes.service';
import axios from "axios";
@Component({
  selector: 'app-haeder',
  templateUrl: './haeder.component.html',
  styleUrls: ['./haeder.component.scss']
})
export class HaederComponent implements OnInit {

  constructor(
    private router:ActivatedRoute,
    private themesService:ThemesService
  ) { }
  email:string;
  role:any=null;
  ten:string;
  themes:string[]=[];
  use=faUser;
  ngOnInit(): void {
    this.getThemes();
    var cookie=getCookie();
    if(cookie.token!=undefined)
    {
      axios.post("https://localhost:44328/api/UserInfo/user?id="+cookie.token)
      .then(res=>{

          if(res.data!=null)
          {
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

  async getThemes() {
    this.themes = await this.themesService.getThemes();
    this.themes.forEach(theme => {
      theme = encodeURIComponent(theme);
    });
  }

}
