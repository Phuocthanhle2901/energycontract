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

  getThemeQuestions(theme:string) {
    console.log(theme);
    this.questionService.getThemeQuestions(theme).subscribe((res:any)=>{
      this.data = res;
      console.log(this.data);
    })
  }

}
