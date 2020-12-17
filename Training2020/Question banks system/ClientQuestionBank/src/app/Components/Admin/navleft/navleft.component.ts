import { Component, OnInit } from '@angular/core';
import { ThemesService } from '../../../Services/themes.service';

@Component({
  selector: 'app-navleft',
  templateUrl: './navleft.component.html',
  styleUrls: ['./navleft.component.scss']
})
export class NavleftComponent implements OnInit {
  themes:string[] = [];
  constructor(private themesService:ThemesService) { }

  ngOnInit(): void {
    this.getThemes();
  }

  getThemes() {
    this.themesService.getThemes().subscribe((res:any)=>{
      this.themes = res;
    })
  }

}
