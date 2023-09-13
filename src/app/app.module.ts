import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MatSliderModule} from '@angular/material/slider';

import { BasicThreeJsComponent } from './basic/scene';

import { AmbientLightComponent } from './lights/ambient.light';


import { SphereGeometryComponent } from './geometries/sphere';
import { BufferSquareGeometryComponent } from './geometries/buffer_square';
import { BufferRingGeometryComponent } from './geometries/buffer_ring';
import { TextureLoaderComponent } from './loaders/texture';

import { CameraBasicComponent } from './camera/basic';

import { GridHelperComponent } from './basic/grid_helper';
import { OrbitControlsComponent } from './controller/orbitcontrol';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    BasicThreeJsComponent,
    GridHelperComponent,
    OrbitControlsComponent,
    SphereGeometryComponent,
    BufferSquareGeometryComponent,
    BufferRingGeometryComponent,
    TextureLoaderComponent,

    CameraBasicComponent,

    AmbientLightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
