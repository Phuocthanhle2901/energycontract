import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from '../../../Models/question.model';
import {UserAnswer} from '../../../Models/UserAnswer.model'
import { TestService } from '../../../Services/test.service'
import { QuestionService } from '../../../Services/question.service'
import {getCookie} from '../../../../assets/js/auth.js';
import axios from 'axios';
import { Router } from '@angular/router';
import { ListQuestion } from 'src/app/Models/listQuestion.model';

@Component({
  selector: 'app-quetstion-body',
  templateUrl: './quetstion-body.component.html',
  styleUrls: ['./quetstion-body.component.scss']
})
export class QuetstionBodyComponent implements OnInit {

  cookie:any;
  theme:string;
  count:number=4;
  questions:Question[] = [];
  answerSheet:FormGroup;
  result:string;
  submitted:boolean;
  userAnswer:UserAnswer;
  email:string
  pageQuestions:Question[] = [];
  questionsPerPage:number=2;
  pageCount:number;
  currentPage:number;
  maxScore:number=0;

  constructor(private testService:TestService, private questionService:QuestionService, private router: Router) {
    let cutPost = window.location.href.indexOf('Test/');
    this.theme =  window.location.href.substring(cutPost+5);
    this.submitted = false;
    this.answerSheet = new FormGroup({});
    for (let i = 0; i < this.count; i++) {
      this.answerSheet.addControl(i.toString(), new FormControl('',Validators.required));
    }
  }

  ngOnInit(): void {
    this.cookie = getCookie();
    this.checkLogin();
    console.log(this.email);
    this.generateTest(this.theme, this.count);
  }

  generateTest(theme:string, count:number ){
    this.testService.generateTest(theme, count).subscribe((res:any)=>{
      this.questions = res;
      this.pageCount = Math.ceil(this.questions.length/this.questionsPerPage)
      this.loadPage(this.pageCount, 0, this.questions); //load first page
    })
  }

  loadPage(pageCount:number ,page:number, questions:Question[]=[]){
    if(questions.length==0) questions = this.questions;
    for (let i = 0; i < this.questionsPerPage; i++) {
      if(questions[i + this.questionsPerPage * page]!=undefined) this.pageQuestions[i] = questions[i + this.questionsPerPage * page];
    }
    this.currentPage = page;
  }

  savePage(answersheet:string[]){
    console.log(answersheet); //check form value
  }

  getResult(answersheet:string[]){
    this.userAnswer = new UserAnswer(); //init user answer
    this.userAnswer.ListQuestion = []; //init question list
    this.userAnswer.Email = this.email; //set email
    this.userAnswer.Summary = 0; //init summary
    this.userAnswer.Date = new Date(); //get date
    //create new result sheet
    for (let i = 0; i < this.questions.length; i++) {
      //get true answer for current question
      this.questionService.getAnswer(this.questions[i].id).subscribe((res:any)=>{
        this.maxScore += this.questions[i].point; //get total point of the test
        this.userAnswer.ListQuestion[i] = new ListQuestion(); //init question
        this.userAnswer.ListQuestion[i].Question = this.questions[i].question; //get question content
        this.userAnswer.ListQuestion[i].Answer = this.questions[i].answer; //get options
        this.userAnswer.ListQuestion[i].Point = 0;
        this.userAnswer.ListQuestion[i].TrueAnswer = res; //get true answer
        if(res===answersheet[i]){
          this.userAnswer.ListQuestion[i].Point = this.questions[i].point;
          this.userAnswer.Summary += this.questions[i].point;
        }
        else this.userAnswer.ListQuestion[i].Point = 0;
        this.userAnswer.ListQuestion[i].UserAnswer = answersheet[i];
        this.result = "Your score: " + this.userAnswer.Summary + "/" + this.maxScore; //update score
        if(i == this.questions.length-1) this.saveResult();
      });
    }
    this.submitted = true;
  }

  saveResult(){
    if(this.email!=null) this.testService.saveResult(this.userAnswer).subscribe(); //post result
  }

  checkLogin(){
    if(this.cookie.token!=undefined) //get user email
    {
      axios.post("https://localhost:44328/api/UserInfo/user?id="+ this.cookie.token)
      .then(res=>{
          this.email = res.data.result.email;
      })
      .catch(err=>console.log(err));
    }
    else this.router.navigate(["/login"]);
  }
}
