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
    trueAnswer:[],
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
      themeName:new FormControl("",Validators.required),
      timeallow:new FormControl("",Validators.required),
      level:new FormControl("",Validators.required),
      point:new FormControl("",Validators.required),

			answer: this.formBuilder.array([// create formArray container one formGroup
				this.formBuilder.group({name: new FormControl("",Validators.required)})
      ]),
      
      correct: this.formBuilder.array([// create formArray container one formGroup
				this.formBuilder.group({cname: new FormControl("",Validators.required)})
      ])
    });
  }

  get answer(): FormArray {
		return this.dataForm.get('answer') as FormArray;// get list answer
  }

  get correct(): FormArray {
		return this.dataForm.get('correct') as FormArray;// get list correct
  }

  addanswer(as:string) {// add formgroup to formdata
    const control = <FormArray>this.dataForm.controls['answer'];
    const correct = <FormArray>this.dataForm.controls['correct'];
    let fg = this.formBuilder.group({name: new FormControl("",Validators.required)});
    let cr = this.formBuilder.group({cname: new FormControl(false,Validators.required)});
    control.push(fg);
    correct.push(cr);
	}
  async ngOnInit(){
    // get themes
    this.themes = await this.themesService.getThemes();
  }

  addAnswer(choose:boolean)// create item answer
  {
   const control = <FormArray>this.dataForm.controls['answer'];
   const correct = <FormArray>this.dataForm.controls['correct'];
    if(choose)
    {
      this.index+=1;
      // control.push(this.formBuilder.control([`answer${this.index}`]));
      this.addanswer(``);
    }
    else if(this.index>0){
      this.index-=1;
      control.removeAt(this.index);
      correct.removeAt(this.index);
    }
  }

  onSubmit()
  {
    this.question.question=this.dataForm.get('question').value;
    this.question.level=this.dataForm.get('level').value;
    this.question.point=this.dataForm.get('point').value;
    this.question.status=true;
    this.question.themeName=this.dataForm.get('themeName').value;
    this.question.timeallow=this.dataForm.get('timeallow').value;
    this.dataForm.get('answer').value.forEach(element => {
      this.question.answer.push(element['name']);
    });
    for (let i = 0; i < this.dataForm.get('correct').value.length; i++) {
      if(this.dataForm.get('correct').value[i]['cname']==true){
        this.question.trueAnswer.push(this.dataForm.get('answer').value[i]['name']);
      }
    }
    console.log(this.question);
    // thực hiện đưa dữ liệu lên wep Api tại đây
    this.questionService.createQuestion(this.question).subscribe((res:any)=>{
      if(res.status==200)
      {
        alert("update question success");
      }
      else{
        alert("update question No success");
      }
    })
    
  }

}
