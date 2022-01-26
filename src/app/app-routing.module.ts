import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicThreeJsComponent } from './basic/scene';
import { GridHelperComponent } from './basic/grid_helper';
import { OrbitControlsComponent } from './controller/orbitcontrol';
import { SphereGeometryComponent } from './geometries/sphere';

const routes: Routes = [

    { path: 'basic', component: BasicThreeJsComponent },
    { path: 'grid-helper', component: GridHelperComponent },
    { path: 'controls/orbitControls', component: OrbitControlsComponent },
    { path: 'geometries/sphere', component: OrbitControlsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
