import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons'
@Component({
  selector: 'app-haeder',
  templateUrl: './haeder.component.html',
  styleUrls: ['./haeder.component.scss']
})
export class HaederComponent implements OnInit {

  constructor(private router:ActivatedRoute) { }

  use=faUser;
  ngOnInit(): void {

  }

}
