/**
 *  육면체(큐브 - BoxGeometry)를 만들고 각각의 방향(L,R,U,D,F,B)에 표면 (PlaneGeometry)을 만들어 붙인다.
 */

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-root',
  templateUrl: './cube-rotate.html',
})

export class CubeRotateComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  // private sceneWidth!: number;
  // private sceneHeight!: number;
  private windowHalfX!: number;
  private windowHalfY!: number;
	private mouseDown = false;
	private startPoint = {x: 0, y: 0};
	private rotateStartPoint = new THREE.Vector3(0, 0, 1);
	private rotateEndPoint = new THREE.Vector3(0, 0, 1);
	private deltaX = 0;
  private deltaY = 0;
	private lastMoveTimestamp: any = 50;
	private moveReleaseTimeDelta = 50;
	private rotationSpeed = 2;
	private container: any;
	private cube!: THREE.Mesh;
	private plane!: THREE.Mesh;
	private curQuaternion: any;

	private mousemovebind: any;
	private mouseupbind: any;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;
	
	


  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.init();
  }

  private init() {
    // this.sceneWidth = this.domContainer.nativeElement.offsetWidth;
    // this.sceneHeight  = this.domContainer.nativeElement.offsetHeight;
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;
    // 

    


    // this.setMesh();
    

		this.setup();
		this.setCamera(); // 카메라 설정
		this.setScene();
		this.setRenderer(); // render 구성
		
		this.createCube();
		this.createPlane();

		this.setLight(); //  조명 설정
		this.animate();
    // this.setOrbitController(); // controls 구

    // this.setGridHelper();
    // this.setAxesHelper();

    // this.createCube();

    // this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {
  }

	private setup()
	{
		this.container = document.createElement('div');
		document.body.appendChild(this.container);

		var info = document.createElement('div');
		info.style.position = 'absolute';
		info.style.top = '10px';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.innerHTML = 'Drag to spin the cube';
		this.container.appendChild(info);
	}

	private setCamera() {
		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
		this.camera.position.x = 0;
    this.camera.position.y = 10;
    this.camera.position.z = 40;
	}

	private setScene() {
		this.scene = new THREE.Scene();
		 this.scene.background = new THREE.Color(0xffffff)
	}

	private setRenderer() {
		this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer : true });
		this.renderer.setClearColor(0xf0f0f0);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;


		// this.container.appendChild(this.renderer.domElement);
		this.domContainer.nativeElement.appendChild(this.renderer.domElement)

		document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
	}

	private createCube() {
		// Cube
		const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
		const positionAttribute = boxGeometry.getAttribute('position');
		// const color = new THREE.Color();
		const colors = [];

		for (var i = 0; i < positionAttribute.count; i += 2)
		{

			const color = {
				h: (1 / (positionAttribute.count)) * i,
				s: 0.5,
				l: 0.5
			};

			colors.push(color.h, color.s, color.l, color.h, color.s, color.l);

			
			// boxGeometry.faces[i].color.setHSL(color.h, color.s, color.l);
			// boxGeometry.faces[i + 1].color.setHSL(color.h, color.s, color.l);

		}

		const colorAttribute = new THREE.Float32BufferAttribute(colors, 3);
		// const colorAttribute = new THREE.Uint8ClampedBufferAttribute(colors, 3);
		boxGeometry.setAttribute('color', colorAttribute);

		var cubeMaterial = new THREE.MeshBasicMaterial(
			{
				vertexColors: true,
				// overdraw: 0.5
			});

		this.cube = new THREE.Mesh(boxGeometry, cubeMaterial);
		this.cube.position.y = 10;
		this.cube.castShadow = true
		this.scene.add(this.cube);
	}

	private createPlane() {
		var planeGeometry = new THREE.PlaneGeometry(50, 50);
		planeGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		const planeMaterial = new THREE.MeshPhongMaterial(
		{
			color: 0xffffff,
			// overdraw: 0.5
		});

		// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

		this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
		this.plane.receiveShadow = true
		this.scene.add(this.plane);
	}



  private onWindowResize()
	{
		this.windowHalfX = window.innerWidth / 2;
		this.windowHalfY = window.innerHeight / 2;

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	private onDocumentMouseDown(event: any)
	{
		event.preventDefault();

		this.mousemovebind = this.onDocumentMouseMove.bind(this);
		this.mouseupbind = this.onDocumentMouseUp.bind(this);
		document.addEventListener('mousemove', this.mousemovebind, false);
		document.addEventListener('mouseup', this.mouseupbind, false);

		this.mouseDown = true;

		this.startPoint = {
			x: event.clientX,
			y: event.clientY
		};

		this.rotateStartPoint = this.rotateEndPoint = this.projectOnTrackball(0, 0);
	}

	private onDocumentMouseMove(event: any)
	{
		this.deltaX = event.x - this.startPoint.x;
		this.deltaY = event.y - this.startPoint.y;

		this.handleRotation();

		this.startPoint.x = event.x;
		this.startPoint.y = event.y;

		this.lastMoveTimestamp = new Date();
	}

	private onDocumentMouseUp(event: any)
	{
		if (new Date().getTime() - this.lastMoveTimestamp.getTime() > this.moveReleaseTimeDelta)
		{
			this.deltaX = event.x - this.startPoint.x;
			this.deltaY = event.y - this.startPoint.y;
		}

		this.mouseDown = false;


		const cubeIntersect = this.getIntersect( {x: event.x, y: event.y}, this.cube, false);
		if(cubeIntersect && cubeIntersect != null) {
			console.log((cubeIntersect as any).face.normal.round());
		}

		document.removeEventListener('mousemove', this.mousemovebind, false);
		document.removeEventListener('mouseup', this.mouseupbind, false);
	}

	private projectOnTrackball(touchX: number, touchY: number)
	{
		var mouseOnBall = new THREE.Vector3();

		mouseOnBall.set(
			this.clamp(touchX / this.windowHalfX, -1, 1), this.clamp(-touchY / this.windowHalfY, -1, 1),
			0.0
		);

		var length = mouseOnBall.length();

		if (length > 1.0)
		{
			mouseOnBall.normalize();
		}
		else
		{
			mouseOnBall.z = Math.sqrt(1.0 - length * length);
		}

		return mouseOnBall;
	}

	private rotateMatrix(rotateStart: any, rotateEnd: any)
	{
		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();

		var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());

		if (angle)
		{
			axis.crossVectors(rotateStart, rotateEnd).normalize();
			angle *= this.rotationSpeed;
			quaternion.setFromAxisAngle(axis, angle);
		}
		return quaternion;
	}

	private clamp(value: number, min: number, max: number)
	{
		return Math.min(Math.max(value, min), max);
	}

	private animate = () => {
		requestAnimationFrame(this.animate);
		this.render();
	}

	private render()
	{
		if (!this.mouseDown)
		{
			var drag = 0.95;
			var minDelta = 0.05;

			if (this.deltaX < -minDelta || this.deltaX > minDelta)
			{
				this.deltaX *= drag;
			}
			else
			{
				this.deltaX = 0;
			}

			if (this.deltaY < -minDelta || this.deltaY > minDelta)
			{
				this.deltaY *= drag;
			}
			else
			{
				this.deltaY = 0;
			}

			this.handleRotation();
		}

		this.renderer.render(this.scene, this.camera);
	}




  private setAxesHelper() {
    const axesHelper = new THREE.AxesHelper( 5 );
    this.scene.add( axesHelper );
  }

  private setLight() {

		 const pointLight = new THREE.PointLight(0xffffff, 1)
			this.scene.add(pointLight)
			pointLight.position.set(0, 10, 15)
			const plhelper = new THREE.PointLightHelper(pointLight, 0.1)
			this.scene.add(plhelper)

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
		//특정방향으로 빛을 비춘다.
		directionalLight.position.set(0, 20, 0)
		//각 빛마다 helper옵션을 줄 수 있다. 첫번째 속성은 빛, 두번째 속성은 사이즈, 세번째는 색
		const dlHelper = new THREE.DirectionalLightHelper(
			directionalLight,
			0.2,
			0x0000ff
		);

    this.scene.add(dlHelper)
		this.scene.add(directionalLight)
		directionalLight.castShadow = true //⭐빛에 castshadow 설정
		// directionalLight.shadow.mapSize.width = 2048 //⭐그림자 해상도 설정, 높을수록 해상도좋다.
  	// directionalLight.shadow.mapSize.height = 2048 //⭐그림자 해상도 설정, 높을수록 해상도좋다.

  }


  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }




	private handleRotation()
	{
		this.rotateEndPoint = this.projectOnTrackball(this.deltaX, this.deltaY);

		const rotateQuaternion = this.rotateMatrix(this.rotateStartPoint, this.rotateEndPoint);
		this.curQuaternion = this.cube.quaternion;
		this.curQuaternion.multiplyQuaternions(rotateQuaternion, this.curQuaternion);
		this.curQuaternion.normalize();
		this.cube.setRotationFromQuaternion(this.curQuaternion);

		this.rotateEndPoint = this.rotateStartPoint;
	};


	 private getIntersect( position: any, object: any, multiple: boolean) {
			
		position.x = ( position.x / window.innerWidth) * 2 - 1;
    position.y = - ( ( position.y / window.innerHeight ) * 2 - 1 );
		const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(
				position,
				this.camera
			);
	
			const intersect = ( multiple )
				? raycaster.intersectObjects( object )
				: raycaster.intersectObject( object );
			return ( intersect.length > 0 ) ? intersect[ 0 ] : false;
		}


		private setOrbitController() {
			this.controls = new OrbitControls( this.camera, this.renderer.domElement );
			this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
			this.controls.update();
		}

}