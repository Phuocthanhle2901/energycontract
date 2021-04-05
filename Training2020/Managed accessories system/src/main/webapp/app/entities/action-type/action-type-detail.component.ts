import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActionType } from 'app/shared/model/action-type.model';

@Component({
  selector: 'jhi-action-type-detail',
  templateUrl: './action-type-detail.component.html',
})
export class ActionTypeDetailComponent implements OnInit {
  actionType: IActionType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionType }) => (this.actionType = actionType));
  }

  previousState(): void {
    window.history.back();
  }
}
