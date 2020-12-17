import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../../Services/question.service';
import { Question } from '../../../../Models/question.model'
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  questions:Question[] = [];
  currentTheme:string;
  pageCount:number;
  currentPage:number;
  url = window.location.href;
  constructor(private questionService:QuestionService) { }

  ngOnInit(): void {
    this.url = window.location.href;
    let pos = this.url.indexOf("questions/");
    let theme = decodeURIComponent(this.url.substr(pos+10));
    this.getThemeQuestions(theme, 0);
    this.getPageCount();
  }

  getThemeQuestions(theme:string, page:number) {
    this.currentTheme = theme;
    this.questionService.getThemeQuestions(theme, page).subscribe((res:any)=>{
      this.questions = res;
      console.log(this.currentTheme);
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

  deleteQuestion(id:any)
  {
    // thực hiện xóa question tại đây
  }
}
