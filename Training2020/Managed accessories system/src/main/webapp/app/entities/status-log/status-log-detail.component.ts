import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStatusLog } from 'app/shared/model/status-log.model';

@Component({
  selector: 'jhi-status-log-detail',
  templateUrl: './status-log-detail.component.html',
})
export class StatusLogDetailComponent implements OnInit {
  statusLog: IStatusLog | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statusLog }) => (this.statusLog = statusLog));
  }

  previousState(): void {
    window.history.back();
  }
}
