import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { ThemesService } from '../../../Services/themes.service';

=======
import {Router}from '@angular/router';
>>>>>>> fbe32e79729b3d2da22f74509e0ab727240e4790
@Component({
  selector: 'app-navleft',
  templateUrl: './navleft.component.html',
  styleUrls: ['./navleft.component.scss']
})
export class NavleftComponent implements OnInit {
<<<<<<< HEAD
  themes:string[] = [];
  constructor(private themesService:ThemesService) { }
=======

  constructor(private router: Router) { }
>>>>>>> fbe32e79729b3d2da22f74509e0ab727240e4790

  ngOnInit(): void {
    this.getThemes();
  }

  getThemes() {
    this.themesService.getThemes().subscribe((res:any)=>{
      this.themes = res;
    })
  }


}
