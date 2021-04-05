import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';

@Component({
  selector: 'jhi-user-equipment-activity-log-detail',
  templateUrl: './user-equipment-activity-log-detail.component.html',
})
export class UserEquipmentActivityLogDetailComponent implements OnInit {
  userEquipmentActivityLog: IUserEquipmentActivityLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userEquipmentActivityLog }) => (this.userEquipmentActivityLog = userEquipmentActivityLog));
  }

  previousState(): void {
    window.history.back();
  }
}
