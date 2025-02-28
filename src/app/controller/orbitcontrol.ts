import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Cube from '../objects/cube';
import {DefaultComponent} from '../default'
@Component({
  selector: 'app-root',
  templateUrl: '../basic/scene.html',
})

export class OrbitControlsComponent extends DefaultComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.init();
  }

  override init() {
      this.canvas.width = this.domContainer.nativeElement.offsetWidth;
      this.canvas.height  = this.domContainer.nativeElement.offsetHeight;

      this.setRenderer(this.domContainer); // render 구성
      this.setScene(); // scene 구성
      this.perspectiveCamera(); // 카메라 설정
      this.createCube();
      document.body.appendChild(this.stats.dom);

      this.orbitController(); // controls 구
      this.gridHelper(1000, 40, 0x303030, 0x303030);
      this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {
  }


  private createCube() {
    const cube = new Cube().colorCube();
    this.scene.add( cube );
  }

  override orbitController() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    const gui = new GUI()
    const physicsFolder = gui.addFolder('OrbitControls')
    physicsFolder.add(this.controls, 'enableDamping');
    physicsFolder.add(this.controls, 'dampingFactor', 0, 1, 0.01);
    physicsFolder.add(this.controls, 'minDistance', 0, 10, 1);
    physicsFolder.add(this.controls, 'maxDistance', 0, 1000, 1);
    physicsFolder.add(this.controls, 'maxPolarAngle', 0, Math.PI, 0.1);
    physicsFolder.add(this.controls, 'zoomSpeed', 0.1, 10, 0.1);
  }
}
