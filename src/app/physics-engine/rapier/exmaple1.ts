// https://sbcode.net/threejs/physics-rapier/
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import RAPIER from '@dimforge/rapier3d-compat';

@Component({
selector: 'app-root',
templateUrl: '../../basic/scene.html',
})

export class RapierSample1Component implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;

  private clock = new THREE.Clock();
  private raycaster = new THREE.Raycaster()
  private mouse = new THREE.Vector2()
  private world!:RAPIER.World;
  private stats!:Stats;
  private dynamicBodies!: [THREE.Object3D, RAPIER.RigidBody][];
  private cubeMesh!:THREE.Mesh;

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

  private async init() {

    await RAPIER.init() // This line is only needed if using the compat version
    const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0)
    this.world = new RAPIER.World(gravity)
    this.dynamicBodies = []




    this.sceneWidth = this.domContainer.nativeElement.offsetWidth;
    this.sceneHeight  = this.domContainer.nativeElement.offsetHeight;
    // this.windowHalfX = window.innerWidth / 2;
    // this.windowHalfY = window.innerHeight / 2;


    
    this.setScene(); // scene 구성
    this.setCamera(); // 카메라 설정
    this.setRenderer(); // render 구성

    this.setLight(); //  조명 설정
    this.setOrbitController(); // controls 구
    this.setGridHelper();


    this.createCubeMesh();
    this.createFloorMesh();

    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
    
    const gui = new GUI()
    
    const physicsFolder = gui.addFolder('Physics')
    physicsFolder.add(this.world.gravity, 'x', -10.0, 10.0, 0.1)
    physicsFolder.add(this.world.gravity, 'y', -10.0, 10.0, 0.1)
    physicsFolder.add(this.world.gravity, 'z', -10.0, 10.0, 0.1)
    this.clock = new THREE.Clock();

    this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {
  }

  private createCubeMesh() {
    // Cuboid Collider
    this.cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
    this.cubeMesh.castShadow = true;
    this.scene.add(this.cubeMesh);
    
    // mass 가 0 일경우 떨어지지 않는다.
    // restitution 이 없을 경우 리바운드 하지 않는다.
    const cubeCollider = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(1).setRestitution(1.1);
    //const cubeCollider = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(1);
    const cubeBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setCanSleep(false));
   
    this.world.createCollider(cubeCollider, cubeBody);
    
    
    console.log('cubeCollider:', cubeCollider);
    console.log('cubeBody:', cubeBody);

    this.dynamicBodies.push([this.cubeMesh, cubeBody]);
  }

  private createFloorMesh() {
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshPhongMaterial());
    floorMesh.receiveShadow = true;
    floorMesh.position.y = -1;
    this.scene.add(floorMesh);

    const floorCollider = RAPIER.ColliderDesc.cuboid(50, 0.5, 50);
    // const floorBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0));
    const floorBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0));
    
    
    console.log('floorBody:', floorBody);
    console.log('floorShape:', floorCollider);
    this.world.createCollider(floorCollider, floorBody);
  }



  private setRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true}); // renderer with transparent backdrop
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.VSMShadowMap
    this.domContainer.nativeElement.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener('click', (e) => {
        this.mouse.set(
          (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
          -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
        )
        this.raycaster.setFromCamera(this.mouse, this.camera)
      
        const intersects = this.raycaster.intersectObjects(
          [this.cubeMesh], // , sphereMesh, cylinderMesh, icosahedronMesh, torusKnotMesh
          false
        )
        if (intersects.length) {
          this.dynamicBodies.forEach((b) => {
            console.log('b:', b);
            b[0] === intersects[0].object && b[1].applyImpulse(new RAPIER.Vector3(0, 10, 0), true)
          })
        }
      })
  }

  private setScene() {
    this.scene = new THREE.Scene(); // the 3d scene
  }

  // 카메라 관련 정의 시작
  private setCamera() {
    const fov = 95; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
    const aspect = this.sceneWidth / this.sceneHeight;  // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).

    const near = 0.1; // [Float] Camera frustum near plane. Default is 0.1.
    const far = 100; // [Float]  Camera frustum far plane. Default is 2000.
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 2, 5);

  }

  private setOrbitController() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.target.y = 1;
  }

  private setGridHelper() {
    const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    helper.position.y = -75;
    this.scene.add( helper );
  }

  private setLight() {
    const light1 = new THREE.SpotLight(undefined, Math.PI * 10)
    light1.position.set(2.5, 5, 5)
    light1.angle = Math.PI / 3
    light1.penumbra = 0.5
    light1.castShadow = true
    light1.shadow.blurSamples = 10
    light1.shadow.radius = 5
    this.scene.add(light1)
    
    const light2 = light1.clone()
    light2.position.set(-2.5, 5, 5)
    this.scene.add(light2)
  }


  private render() {
    const delta = this.clock.getDelta()
    this.world.timestep = Math.min(delta, 0.1)
    this.world.step()
  
    for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
      this.dynamicBodies[i][0].position.copy(this.dynamicBodies[i][1].translation())
      this.dynamicBodies[i][0].quaternion.copy(this.dynamicBodies[i][1].rotation())
    }
  
    this.controls.update()
    this.renderer.render( this.scene, this.camera );
    this.stats.update()
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }
}