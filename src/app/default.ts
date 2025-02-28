import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export class DefaultComponent { // , AfterViewInit

  protected canvas = {width: 0, height: 0};
  private sceneHeight!: number;

  protected renderer!: THREE.WebGLRenderer;
  protected camera!: THREE.PerspectiveCamera;
  protected scene!: THREE.Scene;
  protected controls: any;
  protected stats = new Stats();

  constructor() {
  }

  protected init(domContainer: any) {
    this.canvas.width = domContainer.nativeElement.offsetWidth;
    this.canvas.height  = domContainer.nativeElement.offsetHeight;

    this.setRenderer(domContainer); // render 구성
    this.setScene(); // scene 구성
    this.perspectiveCamera(); // 카메라 설정

    document.body.appendChild(this.stats.dom);

    this.orbitController(); // controls 구
    this.gridHelper(1000, 40, 0x303030, 0x303030);
    this.update(); // 화면을 계속해서 새로이 그린다.
}

  protected setRenderer(domContainer: any) {
    this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer : true }); // renderer with transparent backdrop
    this.renderer.setSize( this.canvas.width, this.canvas.height );
    domContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  protected setScene() {
    this.scene = new THREE.Scene(); // the 3d scene
  }

   // 카메라 관련 정의 시작
   protected perspectiveCamera(fov=50, aspect = 1, near=0.1, far=1000) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 20; // 근/원 거리
    this.camera.zoom = 10; // 근/원 거리
  }

  // protected gridHelper(size?: number, divisions?: number, color1?: THREE.ColorRepresentation, color2?: THREE.ColorRepresentation) {
  protected gridHelper(size?: number, divisions?: number, color1?: THREE.ColorRepresentation, color2?: THREE.ColorRepresentation) {
    // const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    const helper = new THREE.GridHelper( size, divisions, color1, color2 );
    helper.position.y = -75;
    this.scene.add( helper );
  }

  protected orbitController() {
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

  protected render() {
    this.stats.update();
    this.controls.update(); // autoRotate 활성화 하거나 enableDamping=true 일 경우 이 부분이 반드시 필요
    this.renderer.render( this.scene, this.camera );
  }

  protected update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }

  

  /*
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;
  private stats = new Stats();
  

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.init();
  }

  private init() {
      this.sceneWidth = this.domContainer.nativeElement.offsetWidth;
      this.sceneHeight  = this.domContainer.nativeElement.offsetHeight;

      this.setRenderer(); // render 구성
      this.setScene(); // scene 구성
      this.setCamera(); // 카메라 설정

      this.createCube();
      document.body.appendChild(this.stats.dom);

      this.setOrbitController(); // controls 구
      this.setGridHelper();
      this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {
  }


  private createCube() {
    const cube = new Cube().colorCube();
    this.scene.add( cube );
  }

  private setRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer : true }); // renderer with transparent backdrop
    this.renderer.setSize( this.sceneWidth, this.sceneHeight );
    this.domContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private setScene() {
    this.scene = new THREE.Scene(); // the 3d scene
    this.scene.add( new THREE.AmbientLight( 0xAAAAAA ) );
  }

 

  private setOrbitController() {
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

  

 
  */
}
