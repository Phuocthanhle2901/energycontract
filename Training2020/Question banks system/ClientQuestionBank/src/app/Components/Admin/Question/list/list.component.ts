import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(private route:Router) { }

  ngOnInit(): void {

  }

  getQuestion()
  {

  }

  deleteQuestion(id:any)
  {
    // thực hiện xóa question tại đây
  }
}
