import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,FormArray } from '@angular/forms';
import {Question} from '../../../../Models/question.model';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  index:number=0;
  Answers:string[]=[];// list answer
  dataForm:FormGroup;
  question:Question;
  constructor(private formBuilder:FormBuilder ) {

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
    this.question.question=data.question;
    this.question.trueAnswer=data.trueAnswer;
    this.question.themeName=data.themeName;
    this.question.timeallow=data.timeallow;
    this.question.level=data.level;
    this.question.point=data.point;
    data.answer.forEach(data=>{
      this.question.answer.push(data.value);
    })


    console.log(this.question);

    // thực hiện đưa dữ liệu lên wep Api tại đây
  }

}
