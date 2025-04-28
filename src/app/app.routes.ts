import { Routes } from '@angular/router';

import { BasicThreeJsComponent } from './basic/scene';
import { GridHelperComponent } from './basic/grid_helper';
import { OrbitControlsComponent } from './controller/orbitcontrol';
import { SphereGeometryComponent } from './geometries/sphere';
import { BufferSquareGeometryComponent } from './geometries/buffer_square';
import { BufferRingGeometryComponent } from './geometries/buffer_ring';
import { AmbientLightComponent } from './lights/ambient.light';
import { TextureLoaderComponent } from './loaders/texture';
import { GlftLoaderComponent } from './loaders/gltf';
import { GlbLoaderComponent } from './loaders/glb';
import { CameraBasicComponent } from './camera/basic';
// import { CubeComponent } from './example/cube/cube-rotate';
import { CubeComponent } from './example/cube/cube3_3_event_each';
import { CubeRotateComponent} from './example/cube/cube-rotate';
import { DraggableComponent } from './event/draggable';
import { ShadowComponent } from './example/shadow/shadow';
import { RapierSample1Component } from './physics-engine/rapier/exmaple1';
import { RapierSample2Component } from './physics-engine/rapier/exmaple2';
export const routes: Routes = [
  { path: 'basic', component: BasicThreeJsComponent },
  { path: 'grid-helper', component: GridHelperComponent },
  { path: 'controls/orbitControls', component: OrbitControlsComponent },
  { path: 'geometries/sphere', component: SphereGeometryComponent },
  { path: 'geometries/buffer-square', component: BufferSquareGeometryComponent },
  { path: 'geometries/buffer-ring', component: BufferRingGeometryComponent },
  { path: 'loader/texture', component: TextureLoaderComponent },
  { path: 'loader/gltf', component: GlftLoaderComponent },
  { path: 'loader/glb', component: GlbLoaderComponent },
  { path: 'lights/ambient', component: AmbientLightComponent },

  { path: 'camera/basic', component: CameraBasicComponent },
  { path: 'example/cube', component: CubeComponent },
  { path: 'example/cube-rotation', component: CubeRotateComponent },
  
  { path: 'event/draggable', component: DraggableComponent },
  { path: 'example/shadow', component: ShadowComponent },
  { path: 'physics-engine/rapier/exmaple1', component: RapierSample1Component },
  { path: 'physics-engine/rapier/exmaple2', component: RapierSample2Component },
];
