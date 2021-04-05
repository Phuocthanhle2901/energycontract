import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActionLog } from 'app/shared/model/action-log.model';

@Component({
  selector: 'jhi-action-log-detail',
  templateUrl: './action-log-detail.component.html',
})
export class ActionLogDetailComponent implements OnInit {
  actionLog: IActionLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionLog }) => (this.actionLog = actionLog));
  }

  previousState(): void {
    window.history.back();
  }
}
