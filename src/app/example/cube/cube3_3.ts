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

export class CubeComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;
  

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;

  private positions:any[] = [];

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

    this.setRenderer(); // render 구성
    this.setScene(); // scene 구성
    this.setCamera(); // 카메라 설정


    // this.setMesh();
    this.setLight(); //  조명 설정

    this.setOrbitController(); // controls 구

    this.setGridHelper();
    this.setAxesHelper();
    this.generatePositions(); // 각각의 cube가 위치할 좌표값을 구한다.
    this.createCube();

    this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {
  }

  private generatePositions() {
    const size = 3;  // 3x3 cube를 만든다. total 27
    const m = size - 1;
    const first = size % 2 !== 0
      ? 0 - Math.floor(size / 2)
      : 0.5 - size / 2;

    let x, y, z;

    this.positions = [];

    for ( x = 0; x < size; x ++ ) {
      for ( y = 0; y < size; y ++ ) {
        for ( z = 0; z < size; z ++ ) {

          let position: any = new THREE.Vector3(first + x, first + y, first + z);
          let edges = [];
          console.log(x, y, z);
          if ( x == 0 ) edges.push(0);
          if ( x == m ) edges.push(1);
          if ( y == 0 ) edges.push(2);
          if ( y == m ) edges.push(3);
          if ( z == 0 ) edges.push(4);
          if ( z == m ) edges.push(5);

          console.log('edges:', edges);
          position.edges = edges;
          this.positions.push( position );

        }
      }
    }

    console.log('this.positions:', this.positions);
  }

  private createCube() {
    // this.pieces = [];
    // this.edges = [];

    const pieceSize = 1;
    // const colors = ['#003092', '#E07A5F', '#D91656', '#E52020', '#F5F5F5', '#000000'];

    
    const geometry = new THREE.BoxGeometry( pieceSize, pieceSize, pieceSize ); // width, height, depth
    const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
    const pieceMesh = new THREE.Mesh( geometry, material ); 

    this.positions.forEach((position: any, index) =>{

      const piece: any = new THREE.Object3D();
      const pieceCube:THREE.Mesh = pieceMesh.clone();

      piece.add(pieceCube);
      // pieceCube.material.setPosition(position.posions);
      // pieceCube.position.set(position.x, position.y, position.z);
      // pieceCube.position.set(0, 0, position.z);
      // piece.position.set(0, 0, position.z);
      piece.position.set(position.x, position.y, position.z);
      const edgeGeometry:THREE.ExtrudeGeometry = this.depthedPlaneGeometry(
        pieceSize,
        0.01
      );
  
      const mainMaterial = new THREE.MeshLambertMaterial();
      const distance = pieceSize / 2;
      const  cubeposions = [ 'L', 'R', 'D', 'U', 'B', 'F' ];
      // position.edges.forEach((position: any) => {
      cubeposions.forEach((position, index) => {
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

        edge.scale.set(
          0.92,
          0.92,
          0.92
        );
        edge.material.color.setHex(this.colors[position]);
        piece.add(edge);
      })
      
      this.scene.add( piece );
    });

    
 }

  private depthedPlaneGeometry(size: number, depth: number) {
      let x, y, width, height;

      x = y = - size / 2;
      width = height = size;


    const shape = new THREE.Shape();

    shape.moveTo( x, y );
    shape.lineTo( x, y + height );

    shape.lineTo( x + width, y + height );

    shape.lineTo( x + width, y );

    shape.lineTo( x, y );


      // const geometry = new THREE.ExtrudeBufferGeometry(
      return new THREE.ExtrudeGeometry(
        shape,
        { depth: depth, bevelEnabled: false, curveSegments: 3 }
      );
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
    const fov = 50; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
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