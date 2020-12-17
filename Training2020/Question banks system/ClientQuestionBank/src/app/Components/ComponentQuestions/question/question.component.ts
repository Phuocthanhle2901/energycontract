import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../Services/question.service';
import { ThemesService } from '../../../Services/themes.service';
import { Question } from '../../../Models/question.model'

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})

export class QuestionComponent implements OnInit {
  themes:string[] = [];
  data:Question[] = [];
  currentTheme:string;
  pageCount:number;
  currentPage:number;
<<<<<<< HEAD
  
=======

>>>>>>> fbe32e79729b3d2da22f74509e0ab727240e4790
  constructor(
      private questionService:QuestionService,
      private themesService:ThemesService
    ) { }

  ngOnInit(): void {
    this.getThemes();
  }

  getThemes() {
    this.themesService.getThemes().subscribe((res:any)=>{
      this.themes = res;
    })
  }

  getThemeQuestions(theme:string, page:number) {
    this.currentTheme = theme;
    this.questionService.getThemeQuestions(theme, page).subscribe((res:any)=>{
      this.data = res;
    })
    this.currentPage = page;
  }

  getPageCount(){
    this.questionService.getCount(this.currentTheme).subscribe((res:any)=>{
      this.pageCount = res;
      this.pageCount = Math.floor(this.pageCount/5);
      console.log(this.pageCount);
    })
  }

}
