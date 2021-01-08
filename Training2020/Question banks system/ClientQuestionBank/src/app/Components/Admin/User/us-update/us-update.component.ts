import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../../../../Models/user.model';
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
@Component({
  selector: 'app-us-update',
  templateUrl: './us-update.component.html',
  styleUrls: ['./us-update.component.scss']
})
export class UsUpdateComponent implements OnInit {
  dataform: FormGroup;
  register = faDownload;
  message: string;
  passwordNotMatch: boolean;
  defaultValue = "Admin";
  idUser:string="";
  aUser= new User;


  constructor(private http: HttpClient, private formbuilder: FormBuilder, private serviceuser:UserService) {
    this.dataform = this.formbuilder.group({
      fullname: new FormControl('', FullNameValidation),
      id: new FormControl(''),
      email: new FormControl('', EmailValidation),
      password: new FormControl('', PasswordValidation),
      status: new FormControl(Boolean),
      avatar: new FormControl(""),
      confirmpassword: ['', [Validators.required, this.passwordMatcher.bind(this)]],
      role: new FormControl('')
    });
  }
  fileToUpload: File = null;
  ngOnInit(): void {

    this.serviceuser.user$.subscribe((data:any)=>{
      console.log(data)
      this.idUser=data.id;
      this.ShowDataToForm(data);
    })

  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
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
  onchange() {
    this.dataform.controls['confirmpassword'].setValue('');
  }
  ShowDataToForm(data:any)
  {
    this.dataform.controls['id'].setValue(data.id);
      this.dataform.controls['fullname'].setValue(data.fullname);
      this.dataform.controls['email'].setValue(data.email);
      this.dataform.controls['password'].setValue(data.password);
      this.dataform.controls['role'].setValue(data.role);
      this.dataform.controls['status'].setValue(data.status);
      this.dataform.controls['avatar'].setValue(data.avatar);
      this.dataform.controls['confirmpassword'].setValue(data.password);
  }
  submitEditUser(data: any){
    this.aUser.id=data.id;
    this.aUser.fullname=data.fullname;
    this.aUser.email=data.email;
    this.aUser.password=data.password;
    this.aUser.role=data.role;
    this.aUser.status=data.status=="true"?true:false;
    this.aUser.avatar="";
    this.serviceuser.updateUser(this.idUser,this.aUser).subscribe((res:any)=>{
      if(res.status==200)
      {
        alert("update user success");
      }
      else{
        alert("update user unsuccess");
      }
    })


  }

}
