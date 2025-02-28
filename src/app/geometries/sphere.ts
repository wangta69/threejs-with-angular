import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-root',
  templateUrl: '../basic/scene.html',
})

export class SphereGeometryComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
    @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
    private sceneWidth!: number;
    private sceneHeight!: number;

    private renderer!: THREE.WebGLRenderer;
    private camera!: THREE.PerspectiveCamera;
    private scene!: THREE.Scene;
    private controls: any;
    private light!: any;

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
        this.setMesh();
        this.setLight(); //  조명 설정

        this.setOrbitController(); // controls 구

        this.setGridHelper();



        this.update(); // 화면을 계속해서 새로이 그린다.
    }

    ngOnDestroy() {
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
        // this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.light = new THREE.DirectionalLight( 0xdfebff, 1.75);
        this.light.position.set(300, 400, 50);
        this.light.position.multiplyScalar(1.3);

        this.light.castShadow = true;
        this.light.shadowCameraVisible = true;

        this.light.shadowMapWidth = 512;
        this.light.shadowMapHeight = 512;

        const d = 200;

        this.light.shadowCameraLeft = -d;
        this.light.shadowCameraRight = d;
        this.light.shadowCameraTop = d;
        this.light.shadowCameraBottom = -d;

        this.light.shadowCameraFar = 1000;
        this.light.shadowDarkness = 0.2;

        this.scene.add( this.light );
    }

    private setMesh() {
        // 큐버를 만들고 scene에 추가한다.
        const geometry = new THREE.SphereGeometry( 3, 32, 16 ); // radisu, widthSegments, heightSegment
        const material = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
        const sphere = new THREE.Mesh( geometry, material );
        this.scene.add( sphere );
    }


    private render() {


        this.renderer.render( this.scene, this.camera );
    }

    private update = () => {
        this.render();
        requestAnimationFrame(this.update); // request next update
    }


}