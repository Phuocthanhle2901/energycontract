import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'action-log',
        loadChildren: () => import('./action-log/action-log.module').then(m => m.ManagedAccessoriesSystemActionLogModule),
      },
      {
        path: 'action-type',
        loadChildren: () => import('./action-type/action-type.module').then(m => m.ManagedAccessoriesSystemActionTypeModule),
      },
      {
        path: 'area',
        loadChildren: () => import('./area/area.module').then(m => m.ManagedAccessoriesSystemAreaModule),
      },
      {
        path: 'equipment',
        loadChildren: () => import('./equipment/equipment.module').then(m => m.ManagedAccessoriesSystemEquipmentModule),
      },
      {
        path: 'equipment-group',
        loadChildren: () => import('./equipment-group/equipment-group.module').then(m => m.ManagedAccessoriesSystemEquipmentGroupModule),
      },
      {
        path: 'equipment-type',
        loadChildren: () => import('./equipment-type/equipment-type.module').then(m => m.ManagedAccessoriesSystemEquipmentTypeModule),
      },
      {
        path: 'place-to-perform',
        loadChildren: () => import('./place-to-perform/place-to-perform.module').then(m => m.ManagedAccessoriesSystemPlaceToPerformModule),
      },
      {
        path: 'status-log',
        loadChildren: () => import('./status-log/status-log.module').then(m => m.ManagedAccessoriesSystemStatusLogModule),
      },
      {
        path: 'status-type',
        loadChildren: () => import('./status-type/status-type.module').then(m => m.ManagedAccessoriesSystemStatusTypeModule),
      },
      {
        path: 'employee',
        loadChildren: () => import('./employee/employee.module').then(m => m.ManagedAccessoriesSystemEmployeeModule),
      },
      {
        path: 'user-equipment-activity-log',
        loadChildren: () =>
          import('./user-equipment-activity-log/user-equipment-activity-log.module').then(
            m => m.ManagedAccessoriesSystemUserEquipmentActivityLogModule
          ),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class ManagedAccessoriesSystemEntityModule {}
