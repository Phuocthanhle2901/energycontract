import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,FormArray } from '@angular/forms';
import {QuestionService} from "../../../../Services/question.service";
import {Question} from '../../../../Models/question.model';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  index:number=0;
  question={
   
    question:"",
    answer:[],
    trueAnswer:"",
    themeName:"",
    level:1,
    point:1,
    timeallow:1,
    status:true,
     
  };
  Answers:string[]=[];// list answer


  dataForm:FormGroup;
  constructor(private formBuilder:FormBuilder,private questionService:QuestionService) {

  }

  get answer(): FormArray {
		return this.dataForm.get('answer') as FormArray;
  }

  addanswer(as:string) {
    const control = <FormArray>this.dataForm.controls['answer'];
		let fg = this.formBuilder.group({name:as});
		control.push(fg);
	}
  ngOnInit(): void {

		this.dataForm = this.formBuilder.group({// create form group
      question:new FormControl(),
      trueAnswer:new FormControl(),// answer correst
      themeName:new FormControl(),
      timeallow:new FormControl(),
      level:new FormControl(),
      point:new FormControl(),
			answer: this.formBuilder.array([// ceate formArray container one formGroup
				this.formBuilder.group({
          name: new FormControl()
        }),
			])
    });
    this.dataForm.controls['point'].setValue('12');
  }

  addAnswer(choose:boolean)// create item answer
  {
   const control = <FormArray>this.dataForm.controls['answer'];
    if(choose)
    {
      this.index+=1;
      // control.push(this.formBuilder.control([`answer${this.index}`]));
      this.addanswer(``);
    }
    else{
      this.index>0?this.index-=1:this.index=0;
      control.removeAt(this.index);
    }
  }


  onSubmit(data:any)
  {
    // const control = <FormArray>this.dataForm.controls['answer'];


    console.log(data.question)
    this.question.question=data.question;
    this.question.level=data.level;
    this.question.point=data.point;
    this.question.status=true;
    this.question.themeName=data.themeName;
    this.question.timeallow=data.timeallow;
    this.question.trueAnswer=data.trueAnswer;
    data.answer.forEach(element => {
      this.question.answer.push(element.name);
      
    });
    console.log(this.question);

    // thực hiện đưa dữ liệu lên wep Api tại đây
   var result= this.questionService.createQuestion(this.question);

     console.log(result);

  }

}
