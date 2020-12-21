import { Component, OnInit } from '@angular/core';
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
  constructor(private testService:TestService) {
    let cutPost = window.location.href.indexOf('Test/');
    this.theme =  window.location.href.substring(cutPost+5);
    this.count = 3;
  }

  ngOnInit(): void {
    this.generateTest(this.theme, this.count);
  }

  generateTest(theme:string, count:number ){
    this.testService.generateTest(theme, count).subscribe((res:any)=>{
      this.questions = res;
    })
  }

}
