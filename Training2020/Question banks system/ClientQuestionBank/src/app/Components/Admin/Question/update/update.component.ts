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
    trueAnswer:[],
    themeName:"",
    level:1,
    point:1,
    timeallow:1,
    status:true,

  };
  index:number=0;
  Answers:string[]=[];// list answer
  themes:string[]=[];
  checkInvalid = false;
  hiden1:boolean=false;
  dataForm:FormGroup;
  newTheme:string='';
  idQuestion:string="";

  constructor(private formBuilder:FormBuilder, private themesService:ThemesService,
    private questionService:QuestionService) {
    this.dataForm = this.formBuilder.group({// create form group
      question:new FormControl('',[Validators.required]),
      id:new FormControl('',[Validators.required]),
      themeName:new FormControl('',[Validators.required]),
      timeallow:new FormControl('',[Validators.required]),
      level:new FormControl('',[Validators.required]),
      point:new FormControl('',[Validators.required]),
      answer: this.formBuilder.array([]),// ceate formArray container one formGroup
      trueAnswer: this.formBuilder.array([])// ceate formArray container one formGroup
    });
  }

  async ngOnInit(){
    // get themes
    this.themes = await this.themesService.getThemes();
    // get question for update
    this.questionService.question$.subscribe(data=>{
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

  patchQuestionValues(data:Question) {// set data for form
    this.dataForm.controls['question'].setValue(data.question);
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
    for(let i=0;i<data.answer.length; i++){
      if(data.trueAnswer.includes(data.answer[i]))
        this.dataForm.controls['trueAnswer'].value[i]['cname'] = true;
      else this.dataForm.controls['trueAnswer'].value[i]['cname'] = false;
    }
    this.index = data.answer.length - 1;
  }

  // get info formArray
  get answer(): FormArray {
		return this.dataForm.get('answer') as FormArray;
  }

  addanswer(as:string) { //add formGroup to formArray

    const control = <FormArray>this.dataForm.controls['answer'];
    const correct = <FormArray>this.dataForm.controls['trueAnswer'];
    let fg = this.formBuilder.group({name: new FormControl(as,Validators.required)});
    let cr = this.formBuilder.group({cname: new FormControl(false,Validators.required)});
    control.push(fg);
    correct.push(cr);
  }

  addAnswer(choose:boolean)// create item answer
  {
   const control = <FormArray>this.dataForm.controls['answer'];
   const correct = <FormArray>this.dataForm.controls['trueAnswer'];
    if(choose)
    {
      this.index+=1;
      // control.push(this.formBuilder.control([`answer${this.index}`]));
      this.addanswer(``);
    }
    else if(this.index>0){
      this.index-=1;
      control.removeAt(this.index);// delete formGroup at index
      correct.removeAt(this.index);
    }
  }


  onSubmit()
  {
    if(this.check()==true){
      this.question.id = this.idQuestion;
      this.question.question=this.dataForm.get('question').value;
      this.question.level=this.dataForm.get('level').value;
      this.question.point=this.dataForm.get('point').value;
      this.question.status=true;
      this.question.themeName=this.dataForm.get('themeName').value;
      this.question.timeallow=this.dataForm.get('timeallow').value;
      this.dataForm.get('answer').value.forEach(element => {
        this.question.answer.push(element['name']);
      });
      for (let i = 0; i < this.dataForm.get('trueAnswer').value.length; i++) {
        if(this.dataForm.get('trueAnswer').value[i]['cname']==true){
          this.question.trueAnswer.push(this.dataForm.get('answer').value[i]['name']);
        }
      }
      console.log(this.idQuestion);
      // thực hiện đưa dữ liệu lên wep Api tại đây
      this.questionService.editQuestion(this.idQuestion ,this.question).subscribe((res:any)=>{
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

  check(){
    for (let i = 0; i < this.dataForm.get('trueAnswer').value.length; i++) {
      if(this.dataForm.get('trueAnswer').value[i]['cname']==true){
        this.checkInvalid = false;
        return true;
      }
    }
    this.checkInvalid = true;
    return false;
  }

}
