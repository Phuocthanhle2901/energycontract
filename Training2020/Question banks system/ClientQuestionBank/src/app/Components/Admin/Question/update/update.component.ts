import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,FormArray } from '@angular/forms';
import{Question} from '../../../../../assets/js/Models.js';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})

export class UpdateComponent implements OnInit {

  index:number=0;
  question:string;
  Answers:string[]=[];// list answer

  dataForm:FormGroup;
  constructor(private formBuilder:FormBuilder) {
  }

  ngOnInit(): void {

    const data={
      question:"fadsf",
      trueAnswer:"a",
      themeName:"3a",
      level:"1",
      point:"12",
      timeallow:"1",
      status:true,
      answer:[{name:"a"},{name:"b"},{name:"c"}]
    }

		this.dataForm = this.formBuilder.group({// create form group
      question:new FormControl(),
      trueAnswer:new FormControl(),// answer correst
      themeName:new FormControl(),
      timeallow:new FormControl(),
      level:new FormControl(),
      point:new FormControl(),
			answer: this.formBuilder.array([// ceate formArray container one formGroup

			])
    });

    this.patchQuestionValues(data);
  }

  patchQuestionValues(data:any) {// set data for form
    this.dataForm.controls['question'].setValue(data.question);
    this.dataForm.controls['trueAnswer'].setValue(data.trueAnswer);
    this.dataForm.controls['themeName'].setValue(data.themeName);
    this.dataForm.controls['timeallow'].setValue(data.timeallow);
    this.dataForm.controls['level'].setValue(data.level);
    this.dataForm.controls['point'].setValue(data.point);

    for(let i=0;i<data.answer.length;i++)// and formGroup follow length of array
    {
      this.addanswer('');
    }
    this.dataForm.controls['answer'].patchValue(data.answer);
  }

  // get info formArray
  get answer(): FormArray {
		return this.dataForm.get('answer') as FormArray;
  }

  addanswer(as:string) { //add formGroup to formArray
    const control = <FormArray>this.dataForm.controls['answer'];
		let fg = this.formBuilder.group({name:as});
		control.push(fg);
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
      control.removeAt(this.index);// delete formGroup at index
    }
  }


  onSubmit(data:any)
  {
    // const control = <FormArray>this.dataForm.controls['answer'];
    console.log(data);

    // thực hiện đưa dữ liệu lên wep Api tại đây
  }

}
