import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService} from "./equipment.service";

/*
//@ts-ignore
import * as fileSaver from 'file-saver';
*/

@Component({
  selector: 'jhi-equipment-detail',
  templateUrl: './equipment-detail.component.html',
})
export class EquipmentDetailComponent implements OnInit {
  equipment: IEquipment | null = null;


  constructor(protected activatedRoute: ActivatedRoute, protected equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipment }) => (this.equipment = equipment));
  }

  previousState(): void {
    window.history.back();
  }


/*
  exportEquipment(equipment: IEquipment): void{
    this.equipmentService.export(equipment.id!).subscribe(response => {
      const filename = response.headers.get('filename');

      this.saveFile(response.body, filename!);
    });
  }

  saveFile(data: any, filename?: string): void{
    const blob = new Blob([data], {type: 'text/csv; charset=utf-8'});
    fileSaver.saveAs(blob, filename);
  }

 */
}
