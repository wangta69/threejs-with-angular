import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
selector: 'app-root',
templateUrl: '../basic/scene.html',
})

export class GlbLoaderComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;
  private light!: any;


  private myModel: any;
  private sphere!:THREE.Mesh;
  private mouseX = 0;
  private mouseY = 0;

  private targetX = 0;
  private targetY = 0;

  private windowHalfX = 0;
  private windowHalfY = 0;
  private normalTexture:any;
  private clock!: THREE.Clock
  private gui: any;

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
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.clock = new THREE.Clock();
    this.gui = new dat.GUI();

    this.setRenderer(); // render 구성
    this.setScene(); // scene 구성
    this.setCamera(); // 카메라 설정

    // this.textureLoader();
    // this.createMaterial();
    this.glbloader();

    this.setLight(); //  조명 설정
    this.setOrbitController(); // controls 구
    this.setGridHelper();

    this.update(); // 화면을 계속해서 새로이 그린다.
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
  }

  ngOnDestroy() {
  }


  private textureLoader() {
    const textureLoader = new THREE.TextureLoader()
    this.normalTexture = textureLoader.load('https://i.imgur.com/lMotNsf.jpg')
  }


  private createMaterial() {
    const geometry = new THREE.SphereGeometry( .3, 64, 64 );

    // Materials
    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0.7;
    material.roughness = 0.2;
    material.normalMap = this.normalTexture;
    material.color = new THREE.Color(0x292929);

    // Mesh
    this.sphere = new THREE.Mesh(geometry,material);
    this.sphere.position.x = 5;
    this.sphere.position.y = 2;
    this.sphere.position.z = 2;
    this.scene.add(this.sphere);
  }

  private glbloader() {
    const loader = new GLTFLoader();

    loader.load('/assets/star.glb',  ( glb ) => {
      // this.myModel = glb.scene.children[0];
      this.myModel = glb.scene;
      glb.scene.scale.set(0.1, 0.1, 0.1); 
      // this.myModel.scale(100, 100, 100);
      this.myModel.castShadow = true;
      this.scene.add(this.myModel);
      // this.renderer.render(this.scene, this.camera);
      // this.camera.lookAt(this.myModel);
      // glb.animations; // Array<THREE.AnimationClip>
      // glb.scene; // THREE.Group
      // glb.scenes; // Array<THREE.Group>
      // glb.cameras; // Array<THREE.Camera>
      // glb.asset; // Object
        
    }, ( xhr ) => {// called while loading is progressing
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, ( error ) => {// called when loading has errors
      console.log( 'An error happened' );
    });
  }

  private glbloader2(props: any) {

    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
  
      // const { nodes, materials } = useGLTF("./models/star.glb");
  
      loader.load('/assets/star.glb',  ( glb ) => {
        // this.myModel = glb.scene.children[0];
        const myModel = glb.scene; 
        resolve(myModel);
      }, ( xhr ) => {// called while loading is progressing
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      }, ( error ) => {// called when loading has errors
        console.log( 'An error happened' );
      });
    })
  }

  private onDocumentMouseMove(event: any) {
    this.mouseX = (event.clientX - this.windowHalfX)
    this.mouseY = (event.clientY - this.windowHalfY)
  }

  private setRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer : true }); // renderer with transparent backdrop
    this.renderer.setSize( this.sceneWidth, this.sceneHeight );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMappingExposure = 2.3;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.domContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private setScene() {
    this.scene = new THREE.Scene(); // the 3d scene
    
  }

  // 카메라 관련 정의 시작
  private setCamera() {
    const fov = 25; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
    const aspect = this.sceneWidth / this.sceneHeight;  // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).

    const near = 0.1; // [Float] Camera frustum near plane. Default is 0.1.
    const far = 10000; // [Float]  Camera frustum far plane. Default is 2000.
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(50,50,50);
    this.camera.lookAt(0,0,0);

    // this.camera.zoom = 10; // 근/원 거리
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

  private setGridHelper() {
    const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    helper.position.y = -75;
    this.scene.add( helper );
  }

  private setLight() {
    /////////// CREATE LIGHTS //////////
    ////////////////////////////////////////

    //Setup PointLight 1
    const pointLight = new THREE.PointLight(0xffffff, 0.1);
    pointLight.position.x = 2;
    pointLight.position.y = 2;
    pointLight.position.z = 4;
    pointLight.intensity = .2;
    pointLight.castShadow = true;
    //Add light to scene
    this.scene.add(pointLight);
    //create helper
    const pointLightHelper = new THREE.PointLightHelper(pointLight, .5);
    //Add helper to scene
    this.scene.add(pointLightHelper)

    //PointLight 1 GUI
    const light1 = this.gui.addFolder('PointLight 1');
    light1.add(pointLight.position, 'x').min(-6).max(6).step(0.01);
    light1.add(pointLight.position, 'y').min(-5).max(5).step(0.01);
    light1.add(pointLight.position, 'z').min(-5).max(5).step(0.01);
    light1.add(pointLight, 'intensity').min(0).max(10).step(0.01);

    //Setup PointLight 2
    const pointLight2 = new THREE.PointLight(0x8ff, 2);
    pointLight2.position.x = -0.44;
    pointLight2.position.y = 5;
    pointLight2.position.z = 0.06;
    pointLight2.intensity = 1.91;
    pointLight2.castShadow = true;
    this.scene.add(pointLight2);
    const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, .5);
    this.scene.add(pointLightHelper2);

    //PointLight 2 GUI
    const light2 = this.gui.addFolder('PointLight 2');
    light2.add(pointLight2.position, 'x').min(-6).max(6).step(0.01);
    light2.add(pointLight2.position, 'y').min(-5).max(5).step(0.01);
    light2.add(pointLight2.position, 'z').min(-5).max(5).step(0.01);
    light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01);

    const light2Color = {
        color: 0x8ff
    };

    light2.addColor(light2Color, 'color').onChange(() => {
    pointLight2.color.set(light2Color.color)
    })

    // PointLight 3
    const pointLight3 = new THREE.PointLight(0xff0000, 2);
    pointLight3.position.set(1.05,-3.24,0.1);   //x y z
    pointLight3.intensity = 0.1;
    pointLight3.castShadow = true;
    this.scene.add(pointLight3);
    const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, .5);
    this.scene.add(pointLightHelper3);

    //Light 3 GUI
    const light3 = this.gui.addFolder('PointLight 3');
    light3.add(pointLight3.position, 'x').min(-6).max(6).step(0.01);
    light3.add(pointLight3.position, 'y').min(-5).max(5).step(0.01);
    light3.add(pointLight3.position, 'z').min(-5).max(5).step(0.01);
    light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01);

    const light3Color = {
      color: 0xff0000
    }

    light3.addColor(light3Color, 'color').onChange(() => {
      pointLight3.color.set(light3Color.color)
    })

    this.scene.add( new THREE.AmbientLight(0xffffff, 1) );
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

  }


  private render() {
    this.targetX = this.mouseX * .001;
    this.targetY = this.mouseY * .001;

    const elapsedTime = this.clock.getElapsedTime();

    //Update objects - increase number to create automated animation
    // this.sphere.rotation.x = 0 * elapsedTime;
    // this.sphere.rotation.y = 0 * elapsedTime;

    // this.sphere.rotation.x += 2 * (this.targetY - this.sphere.rotation.x);
    // this.sphere.rotation.y += 1.5 * (this.targetX - this.sphere.rotation.y);
  
    if (this.myModel){
      this.myModel.rotation.set(this.targetY, this.targetX, this.myModel.rotation.z);
    }

    this.renderer.render( this.scene, this.camera );
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }
}