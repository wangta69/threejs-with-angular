import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {MatSliderModule} from '@angular/material/slider';

import * as THREE from 'three';

@Component({
  selector: 'app-root',
  imports: [FormsModule, MatIconModule, MatSliderModule],
  templateUrl: 'basic.html',
})

export class CameraBasicComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {
    static: true
  }) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;

 
  private controls!:OrbitControls;

  public sliderFov = {
    disabled: false,
    max: 100,
    min:  -50,
    showTicks: false,
    step: 1,
    thumbLabel: true,
    value: 50, // default
  }

  public sliderNear = {
    disabled: false,
    max: 100,
    min:  -50,
    showTicks: false,
    step: 0.1,
    thumbLabel: true,
    value: 0.1, // default
  }

  public sliderFar = {
    disabled: false,
    max: 20000,
    min:  -50,
    showTicks: false,
    step: 0.1,
    thumbLabel: true,
    value: 2000, // default
  }

  public sliderPositionX = {
    disabled: false,
    max: 10,
    min:  -10,
    showTicks: false,
    step: 0.1,
    thumbLabel: true,
    value: 0, // default
  }

  public sliderPositionY = {
    disabled: false,
    max: 10,
    min:  -10,
    showTicks: false,
    step: 0.1,
    thumbLabel: true,
    value: 0, // default
  }

  public sliderPositionZ = {
    disabled: false,
    max: 100,
    min:  -100,
    showTicks: false,
    step: 0.1,
    thumbLabel: true,
    value: 20, // default
  }

  public sliderZoom = {
    disabled: false,
    max: 10,
    min:  -10,
    showTicks: false,
    step: 0.1,
    thumbLabel: true,
    value: 1, // default
  }

  private cameraOption = {
    fov: 50, // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
    aspect: 0, //  = this.sceneWidth / this.sceneHeight; // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).
    near: 0.1, // [Float] Camera frustum near plane. Default is 0.1.
    far: 10000 // [Float]  Camera frustum far plane. Default is 2000.
  }

  private cameraPosition = {
    x: 0, 
    y: 0,
    z: 20,
  }

  private cameraZoom = 1;

  
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    let interval = setInterval(() => {
      const domContainer = this.domContainer.nativeElement.offsetHeight;
      if (domContainer) {
        clearInterval(interval);
        this.init();
      }
    }, 10)
  }

  private init() {
    this.sceneWidth = this.domContainer.nativeElement.offsetWidth;
    this.sceneHeight = this.domContainer.nativeElement.offsetHeight;

    this.setRenderer(); // render 구성
    this.setScene(); // scene 구성
    this.setCamera(); // 카메라 설정
    this.setGridHelper();
    this.setAxesHelper();
    this.setOrbitController();
    this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {}

  private setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    }); // renderer with transparent backdrop
    this.renderer.setSize(this.sceneWidth, this.sceneHeight);
    this.domContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private setScene() {
    this.scene = new THREE.Scene(); // the 3d scene
    this.scene.add(new THREE.AmbientLight(0xAAAAAA));
  }

  // 카메라 관련 정의 시작
  private setCamera() {

    // const fov = 50; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
    this.cameraOption.aspect = this.sceneWidth / this.sceneHeight; // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).

    // const near = 0.1; // [Float] Camera frustum near plane. Default is 0.1.
    // const far = 10000; // [Float]  Camera frustum far plane. Default is 2000.
    
    console.log(this.cameraOption);
    this.camera = new THREE.PerspectiveCamera(
      this.cameraOption.fov, 
      this.cameraOption.aspect, 
      this.cameraOption.near, 
      this.cameraOption.far
    );
    this.camera.position.x = this.cameraPosition.x;
    this.camera.position.y = this.cameraPosition.y;
    this.camera.position.z = this.cameraPosition.z; // 근/원 거리
    this.camera.zoom = this.cameraZoom; // 근/원 거리
    console.log('this.camera.zoom>>', this.camera.zoom);
    this.camera.updateProjectionMatrix(); // zoom 이 변경될때는 반드시 이 것을 해주어야 zoom이 적용된다.
  }

  private setGridHelper() {
    const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    helper.position.y = -75;
    this.scene.add( helper );
  }

  private setAxesHelper() {
    const axesHelper = new THREE.AxesHelper( 5 );
    this.scene.add( axesHelper );
  }

  private setOrbitController() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 1;
    this.controls.minDistance = 1;
    this.controls.maxDistance = Infinity;
    this.controls.maxPolarAngle = Math.PI / 2; //
    this.controls.zoomSpeed = 0.5;
}

  private render() {
    // 큐버를 만들고 scene에 추가한다.
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    const cube = new THREE.Mesh(geometry, material);
    // cube.position.set(0, -1, 0);
    this.scene.add(cube);

    this.renderer.render(this.scene, this.camera);
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }


  public InputFov(e: any) {
    this.cameraOption.fov = parseFloat(e.target.value);
    this.setCamera();
  }

  public InputNear(e: any) {
    this.cameraOption.near = parseFloat(e.target.value);
    this.setCamera();
    
  }

  public InputFar(e: any) {
    this.cameraOption.far = parseFloat(e.target.value);
    this.setCamera();
  }

  public InputPositionX(e: any) {
    this.cameraPosition.x = parseFloat(e.target.value);
    this.setCamera();
  }

  public InputPositionY(e: any) {
    this.cameraPosition.y = parseFloat(e.target.value);
    this.setCamera();
  }

  public InputPositionZ(e: any) {
    this.cameraPosition.z = parseFloat(e.target.value);
    this.setCamera();
  }

  public InputZoom(e: any) {
    this.cameraZoom = parseFloat(e.target.value);

    this.setCamera();
  }

  

}
