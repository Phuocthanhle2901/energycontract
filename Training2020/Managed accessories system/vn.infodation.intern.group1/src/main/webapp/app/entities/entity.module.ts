import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'action-log',
        loadChildren: () => import('./action-log/action-log.module').then(m => m.JhipsterActionLogModule),
      },
      {
        path: 'action-type',
        loadChildren: () => import('./action-type/action-type.module').then(m => m.JhipsterActionTypeModule),
      },
      {
        path: 'area',
        loadChildren: () => import('./area/area.module').then(m => m.JhipsterAreaModule),
      },
      {
        path: 'equipment',
        loadChildren: () => import('./equipment/equipment.module').then(m => m.JhipsterEquipmentModule),
      },
      {
        path: 'equipment-group',
        loadChildren: () => import('./equipment-group/equipment-group.module').then(m => m.JhipsterEquipmentGroupModule),
      },
      {
        path: 'equipment-type',
        loadChildren: () => import('./equipment-type/equipment-type.module').then(m => m.JhipsterEquipmentTypeModule),
      },
      {
        path: 'place-to-perform',
        loadChildren: () => import('./place-to-perform/place-to-perform.module').then(m => m.JhipsterPlaceToPerformModule),
      },
      {
        path: 'status-log',
        loadChildren: () => import('./status-log/status-log.module').then(m => m.JhipsterStatusLogModule),
      },
      {
        path: 'status-type',
        loadChildren: () => import('./status-type/status-type.module').then(m => m.JhipsterStatusTypeModule),
      },
      {
        path: 'user-equipment-activity-log',
        loadChildren: () =>
          import('./user-equipment-activity-log/user-equipment-activity-log.module').then(m => m.JhipsterUserEquipmentActivityLogModule),
      },
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.module').then(m => m.JhipsterEmployeeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class JhipsterEntityModule {}
