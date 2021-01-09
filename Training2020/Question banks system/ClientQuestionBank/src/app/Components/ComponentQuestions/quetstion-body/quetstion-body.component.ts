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
import { Timer } from 'src/app/Models/timer.mode';
import { EmailValidation, TestNumberValidation } from 'src/app/Validators/validator';
import { config } from 'rxjs';

@Component({
  selector: 'app-quetstion-body',
  templateUrl: './quetstion-body.component.html',
  styleUrls: ['./quetstion-body.component.scss']
})
export class QuetstionBodyComponent implements OnInit {

  cookie:any;
  theme:string; //current test theme
  questions:Question[] = [];
  answerSheet:FormGroup;
  config:FormGroup;
  levelList:number[]; //available levels of test theme
  level:number; //test level
  levelCount:number; //question count of a level
  count:number; //number of questions
  result:string;
  submitted:boolean = false;  //flag for submitting test
  configured:boolean = false; //flag for setting number of questions and level
  confirm:boolean = undefined; //flag for checking if user really wants to submit
  userAnswer:UserAnswer;
  email:string
  pageQuestions:Question[] = [];
  questionsPerPage:number=5; //questions per page (default 5)
  pageCount:number;
  currentPage:number;
  time:number; //time in seconds
  clock:Timer; //time in format HH:mm:ss
  checkBoxes:string[][]=[];

  constructor(private testService:TestService, private questionService:QuestionService, private router: Router) {
    let location = window.location.href;
    let cutPost = location.indexOf('Test/');
    this.theme =  decodeURIComponent(location.substring(cutPost+5));
    this.config = new FormGroup({
      email: new FormControl('', EmailValidation),
      count: new FormControl('',TestNumberValidation),
      level: new FormControl(1)
    });
  }

  async ngOnInit(){
    this.cookie = getCookie();
    this.checkLogin();
    this.levelCount = await this.testService.getTestCount(this.theme, 1);
    this.levelList = await this.testService.getLevels(this.theme);
    this.loadSize(this.levelList[0]);
    this.clock = new Timer();
  }

  async loadSize(level:number){
    this.levelCount = await this.testService.getTestCount(this.theme, level);
    if(this.levelCount>30) this.levelCount = 30;//max number of questions is 30
  }

  getOptions(){
    if((this.config.valid) || (this.email!=undefined && this.config.get('count').value>1)){
      this.answerSheet = new FormGroup({});
      if(this.email==undefined) this.email = this.config.get('email').value;
      this.level = this.config.get('level').value;
      this.count = this.config.get('count').value;
      for (let i = 0; i < this.count; i++) this.answerSheet.addControl(i.toString(), new FormControl('', Validators.required));
      //only start test when there are at least 2 questions, and no more than available questions
      if(this.count>1 && this.count<=this.levelCount){
        this.configured = true;
        this.generateTest(this.theme, this.level, this.count);
      }
    }
  }

  async generateTest(theme:string, level:number, count:number){
    this.questions = await this.testService.generateTest(theme, level, count);
    this.time = 0;
    this.questions.forEach(question=>{this.time += question.timeallow})
    this.pageCount = Math.ceil(this.questions.length/this.questionsPerPage)
    this.loadPage(this.pageCount, 0); //load first page
    while(this.time>0){ //countdown time
      await this.testService.delay();
      this.time -= 1;
      this.clock.calculate(this.time);
      if(this.submitted) break; //stop countdown on submit
    }
    this.getResult(); //submit after countdown
  }

  loadPage(pageCount:number ,page:number){
    this.pageQuestions = [];
    for (let i = 0; i < this.questionsPerPage; i++) {
      if(this.questions[i + this.questionsPerPage * page]!=undefined)
        this.pageQuestions[i] = this.questions[i + this.questionsPerPage * page];
    }
    this.currentPage = page;
  }
  
  async getResult(){
    if(!this.submitted && this.Confirm()){
      //create test content
      let correctAnswer:string;
      this.userAnswer = new UserAnswer(); //init user answer
      this.userAnswer.listquestion = []; //init question list
      this.userAnswer.email = this.email; //set email
      this.userAnswer.level = this.level; //set level
      this.userAnswer.theme = this.theme; //set theme
      this.userAnswer.date = new Date(); //set date
      let maxScore = 0;
      for (let i = 0; i < this.questions.length; i++) {
          maxScore += this.questions[i].point; //calculate total point of the test
          this.userAnswer.listquestion[i] = new ListQuestion(); //init question
          this.userAnswer.listquestion[i].userAnswer = []; //init userAnswer
          this.userAnswer.listquestion[i].id = this.questions[i].id; //set question id
          this.userAnswer.listquestion[i].answer = this.questions[i].answer; //set options
          //set chosen options
          if(this.checkBoxes[i]!=null) this.userAnswer.listquestion[i].userAnswer = this.checkBoxes[i];
          else this.userAnswer.listquestion[i].userAnswer.push(this.answerSheet.value[i]);
      }
      //send test content to server
      let sum = await this.testService.saveResult(this.userAnswer); //server will calculate and send back result
      this.result = "Your score: " + sum + "/" + maxScore; //show result 
      this.submitted = true;
    }
  }

  Confirm(){ //confirm if answerSheet is valid
    if(this.time>0){
      if(this.answerSheet.valid && this.checkBoxValidator()==true){
        this.confirm = true;
        return true;
      }
      this.confirm = false;
      return false
    }
  }
  async checkLogin(){
    if(this.cookie.token!=undefined) //get user email
    {
      axios.post("https://localhost:44328/api/UserInfo/user?id="+ this.cookie.token)
      .then(res=>{
          this.email = res.data.result.email;
      })
      .catch(err=>console.log(err));
    }
  }

  check(q:number, value:string){ //save checkboxes value
    if(this.checkBoxes[q]==null) this.checkBoxes[q] = [];
    if(this.answerSheet.value[q] && !this.checkBoxes[q].includes(value)) {
      this.checkBoxes[q].push(value);
    }
    else if(!this.answerSheet.value[q] && this.checkBoxes[q].includes(value)){
      this.checkBoxes[q].splice(this.checkBoxes[q].indexOf(value),1)
    }
    this.answerSheet.value[q] = "";
  }

  checkBoxValidator(q?: number){ //validate one or all checkboxes
    if(q!=undefined){
      if(this.checkBoxes[q]!=null && this.checkBoxes[q].length>1) return true;
      return false;
    }
    for(let i=0; i< this.checkBoxes.length; i++){
      if(this.checkBoxes[i]!=null && this.checkBoxes[i].length<1) return false;
    }
    return true;
  }

}
