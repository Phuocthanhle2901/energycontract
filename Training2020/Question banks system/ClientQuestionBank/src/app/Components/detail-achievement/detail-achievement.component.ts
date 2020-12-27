import { Component, OnInit  } from '@angular/core';

@Component({
  selector: 'app-detail-achievement',
  templateUrl: './detail-achievement.component.html',
  styleUrls: ['./detail-achievement.component.scss']
})
export class DetailAchievementComponent implements OnInit {

  show=true;  
  correct={
    display: "inline",
    color: 'green',
  }
  hiden={
    display: "inline",
  }
  fail={
    display: "inline",
    color:"#f11c14",
  }

  constructor() { }


  ngOnInit(): void {
  }

}
