import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';


import { IArea } from 'app/shared/model/area.model';
import { AreaService } from 'app/entities/area/area.service';

type SelectableEntity = IArea;

@Component({
  selector: 'jhi-proposing-buy-equipment',
  templateUrl: './proposing-buy-equipment.component.html',
})
export class ProposingBuyEquipmentComponent implements OnInit {
  // isSaving = false;
  areas: IArea[] = [];

  editForm = this.fb.group({
    title: [null, [Validators.required]],
    yourname: [null, [Validators.required]],
    area: [null, Validators.required],
    devicename: [null, [Validators.required]],
    quantity: [null, [Validators.required]],
    reason: [null, [Validators.required]],
  });

  constructor(
    protected areaService: AreaService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(() => {
      this.areaService.query().subscribe((res: HttpResponse<IArea[]>) => (this.areas = res.body || []));
    });
  }

  previousState(): void {
    window.history.back();
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
