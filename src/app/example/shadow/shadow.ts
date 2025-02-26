/**
 *  육면체(큐브 - BoxGeometry)를 만들고 각각의 방향(L,R,U,D,F,B)에 표면 (PlaneGeometry)을 만들어 붙인다.
 */

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


@Component({
  selector: 'app-root',
  templateUrl: '../../basic/scene.html',
})

export class ShadowComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;
  

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;


  constructor() {
  }

  ngOnInit() {
  }

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
    this.sceneHeight  = this.domContainer.nativeElement.offsetHeight;

    
    this.setScene(); // scene 구성
    this.setCamera(); // 카메라 설정
    this.setRenderer(); // render 구성

    this.setOrbitController(); // controls 구

    // this.setGridHelper();
    this.setAxesHelper();

    this.createCube();
    this.createPlane();
    this.setLight(); //  조명 설정

    this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {
  }

  private createCube() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 16)
    const material = new THREE.MeshStandardMaterial({ color: 0x004fff })
    const cube = new THREE.Mesh(geometry, material)
    // cube.rotation.y = 0.5
    cube.position.y = 1
    this.scene.add(cube)

    cube.castShadow = true
    // cube.receiveShadow = true;
  }

  private createPlane() {
    const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    // const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -0.5 * Math.PI
    // plane.position.y = -0.2
    this.scene.add(plane)

    plane.receiveShadow = true; //(포인트 2) 그림자를 받아줄 도형에 receiveShadow 설정
  }



  private setScene() {
    this.scene = new THREE.Scene(); // the 3d scene
    this.scene.background = new THREE.Color(0xffffff)
  }


  private setCamera() {
    const fov = 120; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
    const aspect = this.sceneWidth / this.sceneHeight;  // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).

    const near = 0.1; // [Float] Camera frustum near plane. Default is 0.1.
    const far = 1000; // [Float]  Camera frustum far plane. Default is 2000.
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 1, 1.8)
    this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
  }

  private setRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer : true }); // renderer with transparent backdrop
    this.renderer.setSize( this.sceneWidth, this.sceneHeight );
    this.domContainer.nativeElement.appendChild(this.renderer.domElement);

    this.renderer.shadowMap.enabled = true; // (포인트 1) 렌더러에 그림자 사용 설정
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  private setOrbitController() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.update();
  }

  private setGridHelper() {
    const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    helper.position.y = -1;
    this.scene.add( helper );
  }

  private setAxesHelper() {
    const axesHelper = new THREE.AxesHelper( 5 );
    this.scene.add( axesHelper );
  }

  private setLight() {
    const pointLight = new THREE.PointLight(0xffffff, 1)
    this.scene.add(pointLight)
    pointLight.position.set(-1, 1, 0.5)
    const plhelper = new THREE.PointLightHelper(pointLight, 0.1)
    this.scene.add(plhelper)
    //빛에 castshadow 설정
    pointLight.castShadow = true //그림자 O

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    //특정방향으로 빛을 비춘다.
    directionalLight.position.set(-0.5, 1.5, -0.5)
    //각 빛마다 helper옵션을 줄 수 있다. 첫번째 속성은 빛, 두번째 속성은 사이즈, 세번째는 색
    const dlHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2,
      0x0000ff
    )
    this.scene.add(dlHelper)
    this.scene.add(directionalLight)
    directionalLight.castShadow = true //⭐빛에 castshadow 설정
    // directionalLight.shadow.mapSize.width = 2048 //⭐그림자 해상도 설정, 높을수록 해상도좋다.
    // directionalLight.shadow.mapSize.height = 2048 
  }

  private render() {
    this.renderer.render( this.scene, this.camera );
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }

}