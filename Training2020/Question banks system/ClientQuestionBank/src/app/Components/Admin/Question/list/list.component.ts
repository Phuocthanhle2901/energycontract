import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../../Services/question.service';
import { ThemesService } from '../../../../Services/themes.service';
import { Question } from '../../../../Models/question.model'
import {Router} from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  themes:string[] = [];
  questions:Question[] = [];
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

  getThemeQuestions(theme:string, page:number) {
    this.currentTheme = theme;
    this.questionService.getThemeQuestions(theme, page).subscribe((res:any)=>{
      this.questions = res;
    })
    this.currentPage = page;
  }

  getPageCount(){
    this.questionService.getCount(this.currentTheme).subscribe((res:any)=>{
      this.pageCount = res;
      this.pageCount = Math.floor(this.pageCount/5);
    })
  }

  deleteQuestion(id:any)
  {
    // thực hiện xóa question tại đây
  }
}
