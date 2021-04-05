import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStatusType } from 'app/shared/model/status-type.model';

@Component({
  selector: 'jhi-status-type-detail',
  templateUrl: './status-type-detail.component.html',
})
export class StatusTypeDetailComponent implements OnInit {
  statusType: IStatusType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statusType }) => (this.statusType = statusType));
  }

  previousState(): void {
    window.history.back();
  }
}
