/**
 *  육면체(큐브 - BoxGeometry)를 만들고 각각의 방향(L,R,U,D,F,B)에 표면 (PlaneGeometry)을 만들어 붙인다.
 */

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


@Component({
  selector: 'app-root',
  templateUrl: '../basic/scene.html',
})

export class DraggableComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;
  

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;

  private colors: any = {
    U: 0xfff7ff, // white
    D: 0xffef48, // yellow
    F: 0xef3923, // red
    R: 0x41aac8, // blue
    B: 0xff8c0a, // orange
    L: 0x82ca38, // green
    P: 0x08101a, // piece
    G: 0xd1d5db, // background
  }

  private posions = [ 'L', 'R', 'D', 'U', 'B', 'F' ];

  private element: any;
  private touch: any;
  private drag: any;

  private binddragmove: any;
  private binddragend: any;

  private eventposition = {
    current: {x: 0, y: 0},
    start: {x: 0, y: 0},
    delta: {x: 0, y: 0},
    old: {x: 0, y: 0},
    drag: {x: 0, y: 0},
  }

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

    
    // this.element.addEventListener( 'touchstart', this.drag.start, false );
    // this.element.addEventListener( 'mousedown', this.drag.start, false );
    this.element = document.querySelector( '.domContainer' );
    this.element.addEventListener( 'touchstart', this.dragstart.bind(this), false );
    this.element.addEventListener( 'mousedown', this.dragstart.bind(this), false );
  }


  private dragstart(e: any) {
    console.log('eventstart: e >>', e);
    this.touch = ( e.type == 'touchstart' );
    this.binddragmove = this.dragmove.bind(this);
    this.binddragend = this.dragend.bind(this);
    window.addEventListener( ( this.touch ) ? 'touchmove' : 'mousemove', this.binddragmove, false );
    window.addEventListener( ( this.touch ) ? 'touchend' : 'mouseup', this.binddragend, false );
  }

  private dragmove ( event: any ) {

    const current = JSON.parse(JSON.stringify(this.eventposition.current));
    const old = this.eventposition.old;
    const start = this.eventposition.start;
    this.eventposition.old = current;
    this.getPositionCurrent( event );
    this.eventposition.delta = {x: (current.x - old.x), y: (current.y - old.y)};
    this.eventposition.drag = {x: (current.x - start.x), y: (current.y - start.y)};
    console.log('dragmove >> eventposition >>', JSON.parse(JSON.stringify(this.eventposition)))

  }

  private dragend( event: any ) {
    this.getPositionCurrent( event );
    window.removeEventListener( ( this.touch ) ? 'touchmove' : 'mousemove', this.binddragmove, false );
    window.removeEventListener( ( this.touch ) ? 'touchend' : 'mouseup', this.binddragend, false );
    console.log('dragend >> eventposition >>', JSON.parse(JSON.stringify(this.eventposition)))
  }

  private getPositionCurrent( event: any ) {
    const dragEvent = event.touches
      ? ( event.touches[ 0 ] || event.changedTouches[ 0 ] )
      : event;
    this.eventposition.current = { x: dragEvent.pageX, y: dragEvent.pageY };
    console.log('getPositionCurrent: ', JSON.parse(JSON.stringify(this.eventposition.current)));
  }


  private init() {
    this.sceneWidth = this.domContainer.nativeElement.offsetWidth;
    this.sceneHeight  = this.domContainer.nativeElement.offsetHeight;

    this.setRenderer(); // render 구성
    this.setScene(); // scene 구성
    this.setCamera(); // 카메라 설정


    // this.setMesh();
    this.setLight(); //  조명 설정

    this.setOrbitController(); // controls 구

    this.setGridHelper();
    this.setAxesHelper();

    this.createCube();

    this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {
  }

  private createCube() {
    // this.pieces = [];
    // this.edges = [];

    const pieceSize = 1;
    // const colors = ['#003092', '#E07A5F', '#D91656', '#E52020', '#F5F5F5', '#000000'];


    const piece: any = new THREE.Object3D();
    const geometry = new THREE.BoxGeometry( pieceSize, pieceSize, pieceSize ); // width, height, depth
    const material = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 
    const pieceCube = new THREE.Mesh( geometry, material ); 
    piece.add(pieceCube);

    const edgeGeometry:THREE.PlaneGeometry = new THREE.PlaneGeometry(
      pieceSize,
      pieceSize,
    );


    // edgeGeometry.scale(10, 10, 10);

    // edgeGeometry.position.set()

    const mainMaterial = new THREE.MeshLambertMaterial();
    
    
    const distance = pieceSize / 2;

    this.posions.forEach((position, index) => {
      const edge = new THREE.Mesh( edgeGeometry, mainMaterial.clone() );

      edge.position.set(
        distance * [ - 1, 1, 0, 0, 0, 0 ][ index ],
        distance * [ 0, 0, - 1, 1, 0, 0 ][ index ],
        distance * [ 0, 0, 0, 0, - 1, 1 ][ index ]
      );

      edge.rotation.set(
        Math.PI / 2 * [ 0, 0, 1, - 1, 0, 0 ][ index ],
        Math.PI / 2 * [ - 1, 1, 0, 0, 2, 0 ][ index ],
        0
      );
      edge.material.color.setHex(this.colors[position]);

      piece.add(edge);
    })
    
    this.scene.add( piece );
}

  private setRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer : true }); // renderer with transparent backdrop
    this.renderer.setSize( this.sceneWidth, this.sceneHeight );
    this.domContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private setScene() {
    this.scene = new THREE.Scene(); // the 3d scene
  }


  private setCamera() {
      const fov = 20; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
      const aspect = 1  // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).
  
      const near = 0.1; // [Float] Camera frustum near plane. Default is 0.1.
      const far = 10000; // [Float]  Camera frustum far plane. Default is 2000.
      this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this.camera.position.x = 10;
      this.camera.position.y = 10;
      this.camera.position.z = 10;
      this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
    }

  private setOrbitController() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    // this.controls = {};
    this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.dampingFactor = 1;
    this.controls.minDistance = 1;
    this.controls.maxDistance = Infinity;
    // this.controls.maxPolarAngle = Math.PI / 2; //
    this.controls.zoomSpeed = 0.5;
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

  private setLight() {
    const lights = {
      holder:  new THREE.Object3D,
      ambient: new THREE.AmbientLight( 0xffffff, 0.7),
      front:   new THREE.DirectionalLight( 0xffffff, 3 ),
      back:    new THREE.DirectionalLight( 0xffffff, 0.19 ),
    };

    lights.front.position.set( 1.5, 5, 3 );
    lights.back.position.set( -1.5, -5, -3 );

    lights.holder.add( lights.ambient );
    lights.holder.add( lights.front );
    lights.holder.add( lights.back );

    this.scene.add( lights.holder );

  }

  private render() {
    this.renderer.render( this.scene, this.camera );
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }

}