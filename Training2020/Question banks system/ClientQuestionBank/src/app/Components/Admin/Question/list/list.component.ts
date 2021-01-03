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
    private themesService:ThemesService,private router:Router
  ) { }

  ngOnInit(): void {
    this.getThemes();
    this.getAllQuestion(1);
  }

  async getThemes() {
    this.themes = await this.themesService.getThemes();
  }

  getAllQuestion(page:any)
  {
    this.questionService.getAllQuestion(page).subscribe((data:any)=>{
      console.log(data);
      this.questions=data;
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
      this.pageCount = Math.ceil(this.pageCount/5);
    })
  }


getIdForEditQuestion(value:any)
{
   this.questionService.getQuestionById(value).subscribe((res:any)=>{
      if(res!=null)
      {

        this.questionService.setQuestion(res);
        this.router.navigate(["/admin/updateQuestion"]);
      }
      else{
        alert("Choose agin");
      }
   })
}
  deleteQuestion(id:any)
  {
    var confirmText = "Are you sure you want to delete this question?";
    if(confirm(confirmText)) {
      this.questionService.deleteQuestion(id).subscribe((res:any)=>{
        if(res.deletedCount==1)
        {
          this.getThemeQuestions(this.currentTheme,this.currentPage);
          alert("delete question success")
        }
      })
   }else{
      return false;
   }


    // thực hiện xóa question tại đây
  }
}
