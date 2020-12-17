import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'action-log',
        loadChildren: () => import('./action-log/action-log.module').then(m => m.MasActionLogModule),
      },
      {
        path: 'action-type',
        loadChildren: () => import('./action-type/action-type.module').then(m => m.MasActionTypeModule),
      },
      {
        path: 'area',
        loadChildren: () => import('./area/area.module').then(m => m.MasAreaModule),
      },
      {
        path: 'equipment',
        loadChildren: () => import('./equipment/equipment.module').then(m => m.MasEquipmentModule),
      },
      {
        path: 'equipment-group',
        loadChildren: () => import('./equipment-group/equipment-group.module').then(m => m.MasEquipmentGroupModule),
      },
      {
        path: 'equipment-type',
        loadChildren: () => import('./equipment-type/equipment-type.module').then(m => m.MasEquipmentTypeModule),
      },
      {
        path: 'place-to-perform',
        loadChildren: () => import('./place-to-perform/place-to-perform.module').then(m => m.MasPlaceToPerformModule),
      },
      {
        path: 'status-log',
        loadChildren: () => import('./status-log/status-log.module').then(m => m.MasStatusLogModule),
      },
      {
        path: 'status-type',
        loadChildren: () => import('./status-type/status-type.module').then(m => m.MasStatusTypeModule),
      },
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.module').then(m => m.MasEmployeeModule),
      },
      {
        path: 'user-equipment-activity-log',
        loadChildren: () =>
          import('./user-equipment-activity-log/user-equipment-activity-log.module').then(m => m.MasUserEquipmentActivityLogModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class MasEntityModule {}
