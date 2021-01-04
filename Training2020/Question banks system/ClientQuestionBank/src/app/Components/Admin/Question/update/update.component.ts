import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,FormArray,Validators } from '@angular/forms';
import{Question} from '../../../../../assets/js/Models.js';
import{ThemesService}from '../../../../Services/themes.service';
import {QuestionService}from '../../../../Services/question.service';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})

export class UpdateComponent implements OnInit {

  question={
    id:'',
    question:"",
    answer:[],
    trueAnswer:"",
    themeName:"",
    level:1,
    point:1,
    timeallow:1,
    status:true,

  };
  index:number=0;
  Answers:string[]=[];// list answer
  themes:string[]=[];

  hiden1:boolean=false;
  dataForm:FormGroup;
  newTheme:string='';
  idQuestion:string="";

  constructor(private formBuilder:FormBuilder, private themesService:ThemesService,
    private questionSevice:QuestionService) {
    this.dataForm = this.formBuilder.group({// create form group
      question:new FormControl('',[Validators.required]),
      id:new FormControl('',[Validators.required]),
      trueAnswer:new FormControl('',[Validators.required]),// answer correst
      themeName:new FormControl('',[Validators.required]),
      timeallow:new FormControl('',[Validators.required]),
      level:new FormControl('',[Validators.required]),
      point:new FormControl('',[Validators.required]),
			answer: this.formBuilder.array([// ceate formArray container one formGroup

			])
    });
  }

  ngOnInit(): void {
 // get themes
  this.themesService.getThemes().subscribe((data:any)=>{
    this.themes=data;
  })
  // get question for update
  this.questionSevice.question$.subscribe(data=>{
    this.idQuestion=data.id;
    this.patchQuestionValues(data);
  })

  }
  modelChangeFn(e) {
    this.newTheme = e.target.value;
    this.themes.push(this.newTheme);
  }
  onMouse()
  {
    this.hiden1=false;
  }
  openNewTheme()// open and close new theme
  {
    this.hiden1=true;
    if(this.hiden1==true)
    {
      this.newTheme="";
    }
  }

  patchQuestionValues(data:any) {// set data for form
    this.dataForm.controls['question'].setValue(data.question);
    this.dataForm.controls['trueAnswer'].setValue(data.trueAnswer);
    this.dataForm.controls['id'].setValue(data.id);
    this.dataForm.controls['themeName'].setValue(data.themeName);
    this.dataForm.controls['timeallow'].setValue(data.timeallow);
    this.dataForm.controls['level'].setValue(data.level);
    this.dataForm.controls['point'].setValue(data.point);
    for(let i=0;i<data.answer.length;i++)// and formGroup follow length of array
    {
      this.addanswer(data.answer[i]);
    }
    this.dataForm.controls['answer'].patchValue(data.answer);
  }

  // get info formArray
  get answer(): FormArray {
		return this.dataForm.get('answer') as FormArray;
  }

  addanswer(as:string) { //add formGroup to formArray

    const control = <FormArray>this.dataForm.controls['answer'];
		let fg = this.formBuilder.group({name: new FormControl(as,Validators.required)});
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
    this.question.id=data.id;
    this.question.question=data.question;
    this.question.trueAnswer=data.trueAnswer;
    this.question.themeName=data.themeName;
    this.question.timeallow=data.timeallow;
    this.question.level=data.level;
    this.question.point=data.point;
    this.question.answer=[];
    data.answer.forEach(data=>{
      this.question.answer.push(data.name);
    })
    console.log(this.question.answer);
    this.questionSevice.editQuestion(this.idQuestion,this.question).subscribe((res:any)=>{
      if(res.status==200)
      {

        alert("update question success");
      }
      else{
        alert("update question No success");
      }
    })
    // const control = <FormArray>this.dataForm.controls['answer'];

    // thực hiện đưa dữ liệu lên wep Api tại đây
  }

}
