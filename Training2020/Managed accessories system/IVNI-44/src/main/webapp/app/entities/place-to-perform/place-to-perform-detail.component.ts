import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPlaceToPerform } from 'app/shared/model/place-to-perform.model';

@Component({
  selector: 'jhi-place-to-perform-detail',
  templateUrl: './place-to-perform-detail.component.html',
})
export class PlaceToPerformDetailComponent implements OnInit {
  placeToPerform: IPlaceToPerform | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ placeToPerform }) => (this.placeToPerform = placeToPerform));
  }

  previousState(): void {
    window.history.back();
  }
}
