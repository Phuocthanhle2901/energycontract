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

  currentTheme:string;
  pageCount:number;
  currentPage:number;
  dataform:FormGroup;
  private listQuestion: BehaviorSubject<any> = new BehaviorSubject<any>({});
  listQuestion$: Observable<any> = this.listQuestion.asObservable(); // new data


  constructor(
    private questionService:QuestionService,private fb:FormBuilder,
    private themesService:ThemesService,private router:Router
  ) {
    this.dataform=this.fb.group({
      search:new FormControl(""),
    })
  }

  ngOnInit(): void {
    this.getThemes();
    this.getAllQuestion();
    this.listQuestion$.subscribe((data:any)=>{
      this.questions=data;
    });
  }

  getThemes() {
    this.themesService.getThemes().subscribe((res:any)=>{
       this.themes = res;
    })
  }

  getAllQuestion():any
  {
    this.questionService.getAllQuestion().subscribe((data:any)=>{
      this.listQuestion.next(data);
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
    var confirmText = "Are you sure you want to delete this question?";
    if(confirm(confirmText)) {
      this.questionService.deleteQuestion(id).subscribe((res:any)=>{
        if(res.deletedCount==1)
        {
          this.getAllQuestion();//
          this.listQuestion$.subscribe((data:any)=>{ // chuyển vào bộ nhớ tạm
            this.questions=data;// đưa vào danh sách hiện thị lên client
          });
          alert("delete question success")
        }
      })
   }else{
      return false;
   }

}
}
