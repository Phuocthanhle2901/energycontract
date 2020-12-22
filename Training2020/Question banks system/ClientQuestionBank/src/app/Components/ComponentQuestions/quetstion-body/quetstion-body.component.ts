import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { generate } from 'rxjs';
import { Question } from 'src/app/Models/question.model';
import { TestService } from '../../../Services/test.service'

@Component({
  selector: 'app-quetstion-body',
  templateUrl: './quetstion-body.component.html',
  styleUrls: ['./quetstion-body.component.scss']
})
export class QuetstionBodyComponent implements OnInit {

  theme:string;
  count:number;
  questions:Question[] = [];
  answerSheet:FormGroup;
  result:string;

  constructor(private testService:TestService) {
    let cutPost = window.location.href.indexOf('Test/');
    this.theme =  window.location.href.substring(cutPost+5);
    this.count = 3;
    this.answerSheet = new FormGroup({});
    for (let i = 0; i < this.count; i++) {
      this.answerSheet.addControl(i.toString(), new FormControl('',Validators.required));
    }
  }

  ngOnInit(): void {
    this.generateTest(this.theme, this.count);
  }

  generateTest(theme:string, count:number ){
    this.testService.generateTest(theme, count).subscribe((res:any)=>{
      this.questions = res;
    })
  }

  getResult(answersheet:string[]){
    let maxScore = 0;
    let score = 0;
    for (let i = 0; i < this.questions.length; i++) {
      maxScore += this.questions[i].point;
      if(this.questions[i].trueAnswer===answersheet[i]) score += this.questions[i].point;
    }
    this.result = "Your score: " + score + "/" + maxScore;
  }
}
