import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl,FormArray,  Validators, RequiredValidator } from '@angular/forms';
import {ThemesService} from '../../../../Services/themes.service';
import {QuestionService} from '../../../../Services/question.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

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
  index:number=0;
  Answers:string[]=[];// list answer
  dataForm:FormGroup;
  message:any;
  themes:string[]=[];
  hiden:boolean=false;
  constructor(private formBuilder:FormBuilder,
    private questionService: QuestionService,
    private themesService: ThemesService ) {

    this.dataForm = this.formBuilder.group({// create form group
      question:new FormControl("",Validators.required),
      trueAnswer:new FormControl("",Validators.required),// answer correst
      themeName:new FormControl("",Validators.required),
      timeallow:new FormControl("",Validators.required),
      level:new FormControl("",Validators.required),
      point:new FormControl("",Validators.required),

			answer: this.formBuilder.array([// ceate formArray container one formGroup
				this.formBuilder.group({
          name: new FormControl("",Validators.required)
        }),
			])
    });
  }

  get answer(): FormArray {
		return this.dataForm.get('answer') as FormArray;// get list answer
  }

  addanswer(as:string) {// add formgroup to formdata
    const control = <FormArray>this.dataForm.controls['answer'];
		let fg = this.formBuilder.group({name: new FormControl("",Validators.required)});
		control.push(fg);
  }
  
  ngOnInit(): void {
    // get themes
    this.getThemes();
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
    this.question.answer=[];
    data.answer.forEach(data=>{
      this.question.answer.push(data.name);
    })

    this.questionService.createQuestion(this.question).subscribe((data:any)=>{

      if(data!=null)
      {
         if(data.status==200)
         {
           alert(data.message)
         }
         else{
          alert(data.message)
         }
      }else{
        this.message="have some error. plaese try agin !";
      }
    });
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

  async getThemes(){
    this.themes = await this.themesService.getThemes();
  }
}
