import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  templateUrl: 'scene.html',
})

export class BasicThreeJsComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {
    static: true
  }) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;

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
    const fov = 50; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
    const aspect = this.sceneWidth / this.sceneHeight; // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).

    const near = 0.1; // [Float] Camera frustum near plane. Default is 0.1.
    const far = 10000; // [Float]  Camera frustum far plane. Default is 2000.
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 20; // 근/원 거리
    this.camera.zoom = 10; // 근/원 거리
  }


  private render() {
    // 큐버를 만들고 scene에 추가한다.
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.renderer.render(this.scene, this.camera);
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }

}
