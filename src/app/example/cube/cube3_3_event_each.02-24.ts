/**
 *  육면체(큐브 - BoxGeometry)를 만들고 각각의 방향(L,R,U,D,F,B)에 표면 (PlaneGeometry)을 만들어 붙인다.
 */

/**
 * convert 
 * this.cubes <- this.game.cube.cubes
 * this.piecesObject <-this.game.cube.object
 * this.plane <!- this.helper
 * this.boundry <!- this.edges
 * this.layerGroup<- this.group
 */
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { Face } from 'three/addons/math/ConvexHull.js';
import { gsap, Power2, Power3 } from 'gsap';

const STILL = 0; // 멈춤단계
const PREPARING = 1; // drag 시작단계
const ROTATING = 2; // 수동으로 rotating 단계
const ANIMATING = 3; // 자동으로 rotatin단계(rotation중 mouse를 release 한경우 예상 포지션으로 넘긴다.)

@Component({
  selector: 'app-root',
  templateUrl: './scene.html',
  styleUrl: './cube3_3_event_each.scss'
})

export class CubeComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;
  

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  // private camera!: THREE.OrthographicCamera;
  private scene!: THREE.Scene;
  private controls: any;
  private cubes = new THREE.Group();

  private positions:any[] = [];
  private flipType!:string;
  private flipLayer: any;
  private layerGroup = new THREE.Object3D();

  private  tween: any = {
    rotate: 0,
    delta: 0,
    origin_rotate: 0
    // x: 0,
    // y: 0,
    // z: 0
  };

  private delta = 0;

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
  private boundry:any; //THREE.Mesh;
  private plane!:THREE.Mesh;
  private dragCurrent: any;
  private drag: any;
  private dragNormal: any;
  private element: any;
  private touch: any;
  private dragTotal: any; // 전체 drag 값을 구해서 드레그 되는 주 좌표를 구한다.
  private dragDelta: any;
  private dragDirection: any;
  private flipAxis: any;
  private flipAngle = 0;
  private state = STILL;
  private position = {
    current: new THREE.Vector2(),
    start: new THREE.Vector2(),
    delta: new THREE.Vector2(),
    old: new THREE.Vector2(),
    drag: new THREE.Vector2(),
  }

  // private piecesObject = new THREE.Object3D();
  private piecesObject: any[] = [];
  private momentum: any[] = [];
  private dragIntersect: any;
  constructor() {

    

    this.drag = {

      start: ( event: any ) => {
        if ( event.type == 'mousedown' && event.which != 1 ) return;
        if ( event.type == 'touchstart' && event.touches.length > 1 ) return;

        this.getPositionCurrent( event );


        this.position.start = this.position.current.clone();
        this.position.delta.set( 0, 0 );
        this.position.drag.set( 0, 0 );
        this.touch = ( event.type == 'touchstart' );

        this.onDragStart( this.position );

        if (!this.drag.move) {
          this.drag.move = this.drag.move.bind(this);
        }
        if (!this.drag.end) {
          this.drag.end = this.drag.end.bind(this);
        }

        window.addEventListener( ( this.touch ) ? 'touchmove' : 'mousemove', this.drag.move, false );
        window.addEventListener( ( this.touch ) ? 'touchend' : 'mouseup', this.drag.end, false );
      },

      move: ( event: any ) => {
        this.position.old = this.position.current.clone();

        this.getPositionCurrent( event );

        this.position.delta = this.position.current.clone().sub( this.position.old );
        this.position.drag = this.position.current.clone().sub( this.position.start );

        this.onDragMove( this.position );
      },

      end: ( event: any ) => {
        this.getPositionCurrent( event );

        this.onDragEnd( this.position );
        window.removeEventListener( ( this.touch ) ? 'touchmove' : 'mousemove', this.drag.move, false );
        window.removeEventListener( ( this.touch ) ? 'touchend' : 'mouseup', this.drag.end, false );

      },

    };
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

    this.element = document.querySelector( '.domContainer' );
    this.element.addEventListener( 'touchstart', this.drag.start, false );
    this.element.addEventListener( 'mousedown', this.drag.start, false );
  }

  private init() {
    this.sceneWidth = this.domContainer.nativeElement.offsetWidth;
    this.sceneHeight  = this.domContainer.nativeElement.offsetHeight;

    this.setRenderer(); // render 구성
    this.setScene(); // scene 구성
    this.setCamera(); // 카메라 설정

    this.setLight(); //  조명 설정

    // this.setOrbitController(); // controls 구

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

          if ( x == 0 ) edges.push(0);
          if ( x == m ) edges.push(1);
          if ( y == 0 ) edges.push(2);
          if ( y == m ) edges.push(3);
          if ( z == 0 ) edges.push(4);
          if ( z == m ) edges.push(5);

          position.edges = edges;
          this.positions.push( position );

        }
      }
    }
  }

  private createHelper() {
    const helperMaterial = new THREE.MeshBasicMaterial( { depthWrite: false, transparent: false, opacity: 1, color: 0xFFEA00 } );
    this.plane = new THREE.Mesh(
      // new THREE.PlaneBufferGeometry( 200, 200 ),
      // new THREE.PlaneGeometry( 200, 200 ),
      new THREE.PlaneGeometry(10, 10),
      helperMaterial.clone()
    );

    this.plane.position.set( 0, 0, 0 );
    this.plane.rotation.set( 0, Math.PI/4, 0 ); // Math.PI  = 3.14 radian = 180도

    this.scene.add(this.plane);
    

    // 회전을 계산하기위해 임의 boundry를 만들어 둔다.
    this.boundry = new THREE.Mesh(
      // new THREE.BoxBufferGeometry( 1, 1, 1 ),
      new THREE.BoxGeometry( 3, 3, 3),
      new THREE.MeshBasicMaterial( { depthWrite: false, transparent: false, opacity: 1, color: 0x0033ff } )
      // helperMaterial.clone(),
    );
    this.scene.add(this.boundry);
    this.scene.add(this.cubes);
    this.scene.add(this.layerGroup);
  }

  private createCube() {
    this.createHelper();

    const pieceSize = 1;
    // const colors = ['#003092', '#E07A5F', '#D91656', '#E52020', '#F5F5F5', '#000000'];

    
    const geometry = new THREE.BoxGeometry( pieceSize, pieceSize, pieceSize ); // width, height, depth
    const material = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
    // const material = new THREE.MeshPhongMaterial( {color: 0x000000} ); 
    const pieceMesh = new THREE.Mesh( geometry, material ); 

    this.positions.forEach((position: any, index) =>{

      const piece: any = new THREE.Object3D();
      const pieceCube:THREE.Mesh = pieceMesh.clone();

      piece.add(pieceCube);
      piece.name = index;
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
      // const mainMaterial = new THREE.MeshLambertMaterial({wireframe:true});
      
      // const mainMaterial = new THREE.MeshPhongMaterial({wireframe:true}); 
      const distance = pieceSize / 2;
      const  cubeposions = [ 'L', 'R', 'D', 'U', 'B', 'F' ];

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
      this.piecesObject.push(piece);
      // this.scene.add( piece );
      this.cubes.scale.set(1, 1, 1);
      this.cubes.add(piece);
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

  // drag 관련 시작
  private onDragStart(position: any){
    // STILL인 경우만 진행
    if ( this.state !== STILL) return;

    // Raycaster 를 이용하여 현재 마우스 좌표값을 plane내의 좌표값으로 변경
    const planeIntersect = this.getIntersect( position.current, this.plane, false);
    if(!planeIntersect) return;

    const boundryIntersect: any = this.getIntersect( position.current, this.boundry, false );
    if(boundryIntersect) {
      this.flipType = 'layer';
      this.dragIntersect = this.getIntersect( position.current, this.cubes.children, true );
      this.dragNormal = boundryIntersect.face.normal.round();
      
      this.plane.rotation.set( 0, 0, 0 );
      this.plane.position.set( 0, 0, 0 );
      this.plane.lookAt( this.dragNormal );
      this.plane.updateMatrixWorld();
      // this.plane.quaternion.set(0, 0, 0, 0)
          // this.boundry.updateMatrixWorld();
      console.log('this.dragNormal:', this.dragNormal );
      console.log('this.plane', this.deepcopy(this.plane))
      
      // this.plane.updateMatrixWorld();
      return;
    } else {
      this.flipType = 'cube';

      this.dragNormal = new THREE.Vector3( 0, 0, 1 );
      this.plane.position.set( 0, 0, 0 );
      this.plane.rotation.set( 0, Math.PI/4, 0 ); // Math.PI  = 3.14 radian = 180도
    }

    this.plane.updateMatrixWorld();
    // 월드좌표값을 this.plane내의 좌표 값으로 변경
    // // 변경된 다시한번 더 구한다. planeIntersect를 구한다. 
    // const planeIntersect1: any = this.getIntersect( position.current, this.plane, false);
    this.dragCurrent = this.plane.worldToLocal( planeIntersect.point );
    
    // 이동거리 초기화
    this.dragTotal = new THREE.Vector3();

    // this.state = ( this.state === STILL ) ? PREPARING : this.state;
    this.state = PREPARING;
  }

  private onDragMove(position: any){
    const planeIntersect = this.getIntersect( position.current, this.plane, false);
    
    if(!planeIntersect) {
      console.error('planeIntersect not exist');
      return;
    }
    const point = this.plane.worldToLocal( planeIntersect.point.clone() );
    
    this.dragDelta = point.clone().sub( this.dragCurrent ).setZ( 0 );
    this.dragTotal.add( this.dragDelta );
    this.dragCurrent = point;
    this.addMomentumPoint( this.dragDelta );

    
    if ( this.state === PREPARING  && this.dragTotal.length() > 0.1 ) { //
      this.dragDirection = this.getMainAxis( this.dragTotal );
      
      switch(this.flipType) {
        case 'layer':
          const direction:any = new THREE.Vector3();
          
          direction[ this.dragDirection ] = 1;

          const worldDirection = this.plane.localToWorld( direction ).sub( this.plane.position );

          const objectDirection = this.boundry.worldToLocal( worldDirection ).round();        
          this.flipAxis = objectDirection.cross( this.dragNormal ).negate();
          console.log('this.flipAxis >> ', this.flipAxis);
          this.selectLayer( this.getLayer( false ) );
          this.state = ROTATING;
          break;
        case 'cube':
          const axis = ( this.dragDirection != 'x' )
          ? ( ( this.dragDirection == 'y' && position.current.x > this.sceneWidth / 2 ) ? 'z' : 'x' )
          : 'y';
    
          this.flipAxis = new THREE.Vector3();
          this.flipAxis[ axis ] = 1 * ( ( axis == 'x' ) ? - 1 : 1 );
    
          this.flipAngle = 0;
          this.state = ROTATING;
          break;
      }
     
    } else if ( this.state === ROTATING ) {
      const rotation = this.dragDelta[ this.dragDirection ]; // 이전 및 현재의 dragDelta 값을 구한다.
      switch(this.flipType) {
        case 'layer':
          this.layerGroup.rotateOnAxis( this.flipAxis, rotation );
          this.flipAngle += rotation;
          break;
        case 'cube':
          this.boundry.rotateOnWorldAxis( this.flipAxis, rotation ); //eges 및 cubes의 로테이션을 반영한다.
          this.cubes.rotation.copy( this.boundry.rotation );

          this.cubes.rotateOnWorldAxis( this.flipAxis, rotation );
          this.flipAngle += rotation; // 전체 rotaion의 값을 입력
          break;
      }
      
    }    

  }

  private deepcopy(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  private onDragEnd(position: any) {
    console.log('onDragEnd this.state:', this.state);
    // state가 ROTATING 아니면 끝내고
    if ( this.state !== ROTATING ) {
      this.state = STILL;
      
      // for texgt
    // this.boundry.quaternion.set(0, 0, 0, 1)
      return;
    }

    

    // state 가 ROTATING 이면  ANIMATION으로 전환시켜 마무리 짓는다.
    this.state = ANIMATING;

    const momentum = this.getMomentum()[ this.dragDirection ];
    const flip = ( Math.abs( momentum ) > 0.05 && Math.abs( this.flipAngle ) < Math.PI / 2 );

    const angle = flip
      ? this.roundAngle( this.flipAngle + Math.sign( this.flipAngle ) * ( Math.PI / 4 ) )
      : this.roundAngle( this.flipAngle );

    const delta = angle - this.flipAngle;
    const axis = ( this.dragDirection != 'x' )
    ? ( ( this.dragDirection == 'y' && position.current.x > this.sceneWidth / 2 ) ? 'z' : 'x' )
    : 'y';

    switch(this.flipType) {
      case 'layer':
        this.rotateLayer( delta, false, (layer: any) => {

          // this.game.storage.saveGame();
          
          // this.state = this.gettingDrag ? PREPARING : STILL;
          // this.gettingDrag = false;

          // this.checkIsSolved();
          this.state = STILL;

        } );
        break;
      case 'cube':
        this.rotateCube( delta, axis, () => {
          // console.log('=================================');
          // this.boundry.quaternion.set(0, 0, 0, 1)
          // this.boundry.updateMatrixWorld();
          this.state = STILL;
        });
        break;
    }
    
  }

  private rotateLayer( rotation: number, scramble: boolean, callback:(layer: any)=>void ) {

    this.tween = {
      prerotate: 0,
      rotate: 0,
    };

    gsap.to(this.tween,  {
      ease: Power2.easeOut,
      duration: 0.1,
      rotate: 1,
      onUpdate: () => {

        const delta = this.tween.rotate - this.tween.prerotate;
        this.tween.prerotate = this.tween.rotate;

        let deltaAngle = delta * rotation;
        this.layerGroup.rotateOnAxis( this.flipAxis, deltaAngle );
        // bounce( tween.value, deltaAngle, rotation );

      },
      onComplete: () => {

 
        const layer = this.flipLayer.slice( 0 );

        // this.game.cube.object.rotation.setFromVector3( this.snapRotation( this.game.cube.object.rotation.toVector3() ) );
        // this.group.rotation.setFromVector3( this.snapRotation( this.group.rotation.toVector3() ) );
        this.cubes.rotation.setFromVector3( this.snapRotation(  new THREE.Vector3().setFromEuler(this.cubes.rotation)) );
        this.layerGroup.rotation.setFromVector3( this.snapRotation(  new THREE.Vector3().setFromEuler(this.layerGroup.rotation) ) );

        this.deselectLayer( this.flipLayer );
        callback( layer );
      },
    } );

  }

  private rotateCube( rotation: number, axis: string, callback:() => void) {
    this.tween = {
      prerotate: 0,
      rotate: 0,
    };

    gsap.to(this.tween,  {
      ease: Power2.easeOut,
      duration: 0.1,
      rotate: 1,
      onUpdate: () => {
        const delta = this.tween.rotate - this.tween.prerotate;
        this.tween.prerotate = this.tween.rotate;

        this.boundry.rotateOnWorldAxis( this.flipAxis, rotation * delta );
        this.cubes.rotation.copy( this.boundry.rotation );

      },
      onComplete: () => {
        // 값을 보정한다.
        // this.boundry.quaternion.set(0, 0, 0, 1)   
        // [원본] this.edges.rotation.setFromVector3( this.snapRotation( this.edges.rotation.toVector3() ) ); 
        console.log('this.boundry.rotation 1:', this.deepcopy(this.boundry.rotation));
        this.boundry.rotation.setFromVector3( this.snapRotation( new THREE.Vector3().setFromEuler(this.boundry.rotation) ) ); 
        
        // this.boundry.rotation.setFromVector3( this.snapRotation( this.boundry.rotation ) );  
        console.log('this.boundry.rotation 2:', this.deepcopy(this.boundry.rotation));
        this.cubes.rotation.copy( this.boundry.rotation );
        callback();
      },
    });
  }

  private getMainAxis( vector: any ) {
    return Object.keys( vector ).reduce(
      ( a, b ) => Math.abs( vector[ a ] ) > Math.abs( vector[ b ] ) ? a : b
    );
  }

  private getIntersect( position: any, object: any, multiple: boolean) {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(
      this.convertPosition( position.clone() ),
      this.camera
    );

    const intersect = ( multiple )
      ? raycaster.intersectObjects( object )
      : raycaster.intersectObject( object );
    return ( intersect.length > 0 ) ? intersect[ 0 ] : false;
  }

  private convertPosition( position:any ) {
    position.x = ( position.x / window.innerWidth) * 2 - 1;
    position.y = - ( ( position.y / window.innerHeight ) * 2 - 1 );
    return position;
  }

  private addMomentumPoint( delta: any ) {

    const time = Date.now();
    this.momentum = this.momentum.filter( moment => time - moment.time < 500 );
    if ( delta !== false ) this.momentum.push( { delta, time } );
  }

  private getMomentum() {

    const points = this.momentum.length;
    const momentum:any = new THREE.Vector2();

    this.addMomentumPoint( false );

    this.momentum.forEach( ( point:any, index ) => {

      momentum.add( point.delta.multiplyScalar( index / points ) );

    } );

    return momentum;

  }

  private roundAngle( angle: number ) {
    const round = Math.PI / 2;
    return Math.sign( angle ) * Math.round( Math.abs( angle) / round ) * round;
  }

  private getPositionCurrent( event: any ) {
    const dragEvent = event.touches
      ? ( event.touches[ 0 ] || event.changedTouches[ 0 ] )
      : event;
    this.position.current.set( dragEvent.pageX, dragEvent.pageY );
  }

  /**
   * 에니메이션이 끝났을때 값을 보정
   * @param angle 
   * @returns 
   */
  private snapRotation( angle: any ) {
    return angle.set(
      this.roundAngle( angle.x ),
      this.roundAngle( angle.y ),
      this.roundAngle( angle.z )
    );
  }
  // drag 관련 끝

  // layer 관련

  private getLayer( position: any ) {

    // const scalar = { 2: 6, 3: 3, 4: 4, 5: 3 }[ this.game.cube.size as 2|3|4|5 ];
    const scalar = 3;
    const layer:string[] = [];

    let axis;
    console.log('getLayer>> position >>', position);
    if ( position === false ) {
      const piece = this.dragIntersect.object.parent;
      axis = this.getMainAxis( this.flipAxis );
      position = piece.position.clone().multiplyScalar( scalar ).round();
    } else {
      axis = this.getMainAxis( position );
    }

    // this.game.cube.pieces.forEach( (piece: any) => {
    console.log('getLayer>> axis >>', axis);
    this.piecesObject.forEach( (piece: any) => {
      const piecePosition = piece.position.clone().multiplyScalar( scalar ).round();
      if ( piecePosition[ axis ] == position[ axis ] ) layer.push( piece.name );
    });
    return layer;
  }

  private selectLayer( layer: any ) {
    this.layerGroup.rotation.set( 0, 0, 0 );
    this.movePieces( layer, this.cubes , this.layerGroup );
    this.flipLayer = layer;
  }

  private deselectLayer( layer: any ) {
    // this.movePieces( layer, this.layerGroup, this.game.cube.object );
    this.movePieces( layer, this.layerGroup, this.cubes );
    this.flipLayer = null;
  }

  /**
   * from에 존재하는 object를 to로 이동
   * 
   * @param layer 
   * @param from 
   * @param to 
   */
  private movePieces( layer: any, from: THREE.Object3D, to: THREE.Object3D ) {
    from.updateMatrixWorld();
    to.updateMatrixWorld();

    layer.forEach( (index:number) => {

      // const piece: THREE.Object3D = this.game.cube.pieces[ index ];
      const piece: THREE.Object3D = this.piecesObject[index];

      // piece.applyMatrix( from.matrixWorld );
      piece.applyMatrix4( from.matrixWorld );
      from.remove( piece );
      piece.applyMatrix4( new THREE.Matrix4().copy( to.matrixWorld ).invert() );

      to.add( piece );
    } );

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
    const fov = 40; // [Float]  Camera frustum vertical field of view, from bottom to top of view, in degrees. Default is 50.
   // const aspect = 1;  // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).
    const aspect = this.sceneWidth / this.sceneHeight;
    const near = 0.1; // [Float] Camera frustum near plane. Default is 0.1.
    const far = 10000; // [Float]  Camera frustum far plane. Default is 2000.
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // this.camera = new THREE.OrthographicCamera(-60, 60, 40, -40, near, far); // 
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    
    // this.camera.zoom = 0.85;
    this.camera.lookAt(new THREE.Vector3( 0, 0, 0 ));
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