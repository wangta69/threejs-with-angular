import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

@Component({
  selector: 'app-root',
  templateUrl: '../basic/scene.html',
})

export class OrbitControlsComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;
  private stats = new Stats();
  constructor() {
  }

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

  /*
  private createCube() {
    // 큐버를 만들고 scene에 추가한다.
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
    const cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );
  }
  */

  private createCube() {
    // 큐버를 만들고 scene에 추가한다.
    const geometry = new THREE.BoxGeometry();
    const positionAttribute = geometry.getAttribute('position');
    const material = new THREE.MeshBasicMaterial( { vertexColors: true} );

    const colors = [];
    for (var i = 0; i < positionAttribute.count; i += 2)
    {
      const color = {
        h: (1 / (positionAttribute.count)) * i,
        s: 0.5,
        l: 0.5
      };
      colors.push(color.h, color.s, color.l, color.h, color.s, color.l);
    }

    const colorAttribute = new THREE.Float32BufferAttribute(colors, 3);
    geometry.setAttribute('color', colorAttribute);

    const cube = new THREE.Mesh( geometry, material );
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

  // 카메라 관련 정의 시작
  private setCamera() {
    const fov = 50; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
    const aspect = this.sceneWidth / this.sceneHeight;  // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).

    const near = 0.1; // [Float] Camera frustum near plane. Default is 0.1.
    const far = 10000; // [Float]  Camera frustum far plane. Default is 2000.
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 20; // 근/원 거리
    this.camera.zoom = 10; // 근/원 거리
  }

  private setOrbitController() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true; // enableDamping이 true일 경우 에니메이션 루프에서 .update()를 호출해야만 감쇠 관성를 사용할 수 있습니다.Default is 0.05.
    this.controls.dampingFactor = 0.05; // enableDamping이 true
    this.controls.minDistance = 1;
    this.controls.maxDistance = Infinity;
    this.controls.maxPolarAngle = Math.PI / 2; //
    this.controls.zoomSpeed = 0.5;


    const gui = new GUI()
    const physicsFolder = gui.addFolder('OrbitControls')
    physicsFolder.add(this.controls, 'enableDamping');
    physicsFolder.add(this.controls, 'dampingFactor', 0, 1, 0.01);
    physicsFolder.add(this.controls, 'minDistance', 0, 10, 1);
    physicsFolder.add(this.controls, 'maxDistance', 0, 1000, 1);
    physicsFolder.add(this.controls, 'maxPolarAngle', 0, Math.PI, 0.1);
    physicsFolder.add(this.controls, 'zoomSpeed', 0.1, 10, 0.1);
  }

  private setGridHelper() {
    const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    helper.position.y = -75;
    this.scene.add( helper );
  }

  private render() {
    this.stats.update();
    this.renderer.render( this.scene, this.camera );
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }
}
