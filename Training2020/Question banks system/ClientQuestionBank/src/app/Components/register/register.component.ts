import { Component, OnInit } from '@angular/core';
import { faDownload } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor() { }
  //icon cho font end
  register=faDownload;




  ngOnInit(): void {
  }

}
