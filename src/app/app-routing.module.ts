import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BasicThreeJsComponent } from './basic/scene';
import { GridHelperComponent } from './basic/grid_helper';
import { OrbitControlsComponent } from './controller/orbitcontrol';
import { SphereGeometryComponent } from './geometries/sphere';
import { BufferSquareGeometryComponent } from './geometries/buffer_square';
import { BufferRingGeometryComponent } from './geometries/buffer_ring';
import { AmbientLightComponent } from './lights/ambient.light';
import { TextureLoaderComponent } from './loaders/texture';

const routes: Routes = [

    { path: 'basic', component: BasicThreeJsComponent },
    { path: 'grid-helper', component: GridHelperComponent },
    { path: 'controls/orbitControls', component: OrbitControlsComponent },
    { path: 'geometries/sphere', component: SphereGeometryComponent },
    { path: 'geometries/buffer-square', component: BufferSquareGeometryComponent },
    { path: 'geometries/buffer-ring', component: BufferRingGeometryComponent },
    { path: 'loader/texture', component: TextureLoaderComponent },

    { path: 'lights/ambient', component: AmbientLightComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
