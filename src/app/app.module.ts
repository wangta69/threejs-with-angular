import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BasicThreeJsComponent } from './basic/scene';


import { SphereGeometryComponent } from './geometries/sphere';

import { GridHelperComponent } from './basic/grid_helper';
import { OrbitControlsComponent } from './controller/orbitcontrol';


@NgModule({
  declarations: [
    AppComponent,
    BasicThreeJsComponent,
    GridHelperComponent,
    OrbitControlsComponent,
    SphereGeometryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
