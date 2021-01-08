import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../../../Services/question.service';
import { ThemesService } from '../../../../Services/themes.service';
import { Question } from '../../../../Models/question.model'
import {Router} from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {
  themes:string[] = [];
  questions:Question[] = [];
  questionsSearch:Question[] = [];

  textdelete:any='';
  currentTheme:string;
  pageCount:number;
  currentPage:number;
  biodelete:boolean=false;
  dataform:FormGroup;
  private listQuestion: BehaviorSubject<any> = new BehaviorSubject<any>({});
  listQuestion$: Observable<any> = this.listQuestion.asObservable(); // new data


  themed:boolean;
  constructor(
    private questionService:QuestionService,private fb:FormBuilder,
    private themesService:ThemesService,private router:Router
  ) {
    this.dataform=this.fb.group({
      search:new FormControl(""),
    })
  }

  async ngOnInit(){
    this.getThemes();
    this.getAllQuestion(0);
    let count = await this.questionService.getTotalCount();
    this.pageCount = Math.ceil(count/5);
  }

  async getThemes() {
    this.themes = await this.themesService.getThemes();
  }
clickDelete()
{
  this.biodelete=true;
}
  getAllQuestion(page:any)
  {
    this.themed = false;
    this.currentPage = page;
    this.questionService.getAllQuestion(page).subscribe((data:any)=>{
      this.questions=data;
      console.log(this.questions.length);
    })
  }

  getThemeQuestions(theme:string, page:number) {
    this.currentTheme = theme;
    this.themed = true;
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
        alert("Choose again");
      }
   })
}

SearchByName(data:any)
{
  this.listQuestion$.subscribe((data:any)=>{
    this.questionsSearch=data;
  });
  this.questions=[];
   this.questionsSearch.filter((res)=>{
     if(res.question.toLowerCase().indexOf(data.search)!=-1)
     {
      this.questions.push(res);
     }
  })

}
  deleteQuestion(id:any)
  {
    this.textdelete="Are you sure you want to delete this question?";

      this.questionService.deleteQuestion(id).subscribe((res:any)=>{
        if(res.deletedCount==1)
        {
          this.getAllQuestion(0);//
          this.listQuestion$.subscribe((data:any)=>{ // chuyển vào bộ nhớ tạm
            this.questions=data;// đưa vào danh sách hiện thị lên client
          });

        }
      })


}
}
