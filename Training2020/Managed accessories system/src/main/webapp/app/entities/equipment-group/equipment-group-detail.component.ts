import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEquipmentGroup } from 'app/shared/model/equipment-group.model';

@Component({
  selector: 'jhi-equipment-group-detail',
  templateUrl: './equipment-group-detail.component.html',
})
export class EquipmentGroupDetailComponent implements OnInit {
  equipmentGroup: IEquipmentGroup | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipmentGroup }) => (this.equipmentGroup = equipmentGroup));
  }

  previousState(): void {
    window.history.back();
  }
}
