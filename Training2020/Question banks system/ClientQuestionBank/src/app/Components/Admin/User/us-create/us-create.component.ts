import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { HttpClient,HttpEventType } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  FullNameValidation,
  EmailValidation,
  PasswordValidation,
} from '../../../../Validators/validator';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../../../Services/user.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-us-create',
  templateUrl: './us-create.component.html',
  styleUrls: ['./us-create.component.scss']
})
export class UsCreateComponent implements OnInit {
  dataform: FormGroup;
  register = faDownload;
  message: string;
  passwordNotMatch: boolean;
  defaultValue = "Admin";
  url:string;



  private image: BehaviorSubject<any> = new BehaviorSubject<any>({});
  image$: Observable<any> = this.image.asObservable(); // new data
  @Output() public onUploadFinished = new EventEmitter();
  constructor(private http: HttpClient,private formbuilder: FormBuilder, private serviceuser:UserService) {
    this.dataform = this.formbuilder.group({
      fullname: new FormControl('', FullNameValidation),
      email: new FormControl('', EmailValidation),
      password: new FormControl('', PasswordValidation),
      confirmpassword: ['', [Validators.required, this.passwordMatcher.bind(this)]],
      role: new FormControl(''),
      avatar: new FormControl(''),
      status: new FormControl(true),
    });
  }
   fileToUpload:any=null;

  ngOnInit(): void {
  }

  readUrl=(files)=> {

    if (files.length != 0) {
      var reader = new FileReader();
      this.fileToUpload=<File>files[0];
      reader.onload = (event: any) => {
        this.url = event.target.result;
      }
      reader.readAsDataURL(files[0]);
    }

  }

  passwordMatcher(control: FormControl): { [s: string]: boolean } {
    if (
      this.dataform &&
      control.value !== this.dataform.get('password').value
    ) {
      return { passwordNotMatch: true };
    }
    return null;
  }
  public uploadFile = (files) => {
    const formData = new FormData();
    formData.append('file', files, files.name);
    this.http.post('https://localhost:44328/api/UserInfo/Upload', formData)
      .subscribe((event:any) => {
        this.dataform.controls['avatar'].setValue(event.data);
      });
  }

  submitAddUser(data: any){

    if(this.fileToUpload!=null)
    {
      const formData = new FormData();
      formData.append('file', this.fileToUpload, this.fileToUpload.name);
      this.http.post('https://localhost:44328/api/UserInfo/Upload', formData)
      .subscribe((event:any) => {
        if(event.data!="")
        {
          this.dataform.controls["avatar"].setValue(event.data);
          this.createUser(this.dataform.value);
        }
      });
    }
    else{
      this.createUser(data);
    }


  }

  createUser(value:any)
  {
  this.serviceuser.createUser(value).subscribe((data:any)=>{
    if(data==true)
    {
      alert("Create Account success")
    }
    else{
      alert("Email already exists")
    }
 })}

  onchange() {
    this.dataform.controls['confirmpassword'].setValue('');
  }


}
