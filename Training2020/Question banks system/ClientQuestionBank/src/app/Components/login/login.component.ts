import { Component, OnInit } from '@angular/core';
import { faSign } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-register',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  signin=faSign;
  constructor() { }
  //icon cho font end



  ngOnInit(): void {
  }
  getAccount(e,email,pass)
  {

  }

}
