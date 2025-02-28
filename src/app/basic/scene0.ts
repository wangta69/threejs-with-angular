import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core'; // ViewEncapsulation,
import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { PlanetsInfo, SunPlanets } from './interface';
// import { GameAnimations } from './animations';

// type Nullable<T> = T | null;

@Component({
  selector: 'app-root',
  templateUrl: 'scene.html',
  // styleUrls: ['game.page.scss'],
  // animations: GameAnimations,
  // encapsulation: ViewEncapsulation.None
})

export class BasicThreeJsComponent implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
    @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
    private sceneWidth!: number;
    private sceneHeight!: number;

    private renderer!: THREE.WebGLRenderer;
    private camera!: THREE.PerspectiveCamera;
    private controls: any;

    private pivots!: THREE.Group[];
    // private material: THREE.MeshLambertMaterial;
    private scene!: THREE.Scene;
//    private raycaster: THREE.Raycaster;
//    private mouse: THREE.Vector2;

    // private spaceship!: THREE.Object3D;
    // InfoState = 'inactive';
    // // private INTERSECTED: any;
    //
    //
    // private selectedPlanetName!: string;
    // private selectedPlanet!: THREE.Object3D;
    // private planets!: THREE.Object3D[];
    // public planetInfo: any;
    // public sunPlanets = SunPlanets;

    // private PlanetsInfo: any;
//     private scaleBy = 'radius';
// //    private satMargin = 0.1;
//     private castShadows = false;

/*
    @HostListener('document:mousemove', ['$event'])
    mousemove(e: any) {
        this.mouse.x = ( e.clientX / this.sceneWidth ) * 2 - 1;
        this.mouse.y = - ( e.clientY / this.sceneHeight ) * 2 + 1;
    }
    */
    /*
    @HostListener('document:mousedown', ['$event'])
    mousedown(e: any) {
        this.mouse.x = ( e.clientX / this.sceneWidth ) * 2 - 1;
        this.mouse.y = - ( e.clientY / this.sceneHeight ) * 2 + 1;
        this.interSects();
    }
    */
    // @HostListener('window:resize')
    // onResize() {
    //     this.onWindowResize();
    // }

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let interval = setInterval(() => {

            let flag = this.domContainer.nativeElement.offsetHeight;
            console.log(flag);
            if (flag) {
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
    //     this.buildSpaceship();
    //     this.setOrbitController();
    //
    //     this.buildScene();
    //
    //
    // //    this.raycaster = new THREE.Raycaster();
    // //    this.mouse = new THREE.Vector2();
    //     this.setGridHelper();
    //
    //     this.setPlanet('solarsystem');
         this.update();
    }

    ngOnDestroy() {
    }

    private setRenderer() {
        this.renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer : true }); // renderer with transparent backdrop
        this.renderer.setSize( this.sceneWidth, this.sceneHeight );
        // this.renderer.shadowMap.enabled = this.castShadows;
        this.domContainer.nativeElement.appendChild(this.renderer.domElement);
        // renderer.shadowMapSoft = PlanetsInfo.config.shadows.softShadows;
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
        this.camera.position.z = 0; // 근/원 거리
        this.camera.zoom = 10; // 근/원 거리
    }
    //
    // // 카메라 관련 정의 끝
    //
    // // 카메라를 이곳에 장착하여 움직일 예정임
    // private buildSpaceship() {
    //     const spaceship = new THREE.Object3D();
    //     spaceship.name = 'spaceship';
    //     this.spaceship = spaceship;
    //
    //     this.scene.add(this.spaceship);
    // }
    //
    // /**
    //  * 태양계를 만든다.
    //  */
    // private buildScene() {
    //
    //     this.planets = [];
    //     this.pivots = [];
    //
    //     // 먼저 현재 scale값을 자동으로 다시 변경해 준다.(아직 원하는 scale값을 찾지 못함)
    //     this.updateScale();
    //
    //     // create sun
    //     const sun = this.createMesh(PlanetsInfo.sun, 0, 0, false);
    //     this.scene.add(sun);
    //
    //     console.log(PlanetsInfo.planets);
    //     for (const def of PlanetsInfo.planets) {
    //         const planet: any = this.createMesh(def, 0, 0, true);
    //         planet.rotation.x = 15 * (Math.PI / 180);
    //         planet.name = def.name;
    //         planet.userData = def;
    //         this.planets.push(planet);
    //         this.scene.add(planet);
    //
    //         const pivot = new THREE.Group();
    //         pivot.name = planet.name + '_pivot';
    //         pivot.add(planet);
    //         pivot.rotation.y  = Math.random() * 360;
    //         pivot.userData = planet.userData;
    //         this.scene.add( pivot );
    //         this.pivots.push(pivot);
    //     }
    //
    //     this.updatePlanetPositions();
    //
    //     let spot1 = null;
    //
    //     // Weird issue with SpotLight... Will investigate later
    //     if (this.castShadows) {
    //         // spot1 = new THREE.SpotLight( 0xFFFFFF, 1 , 0, PlanetsInfo.config.shadows.castShadows);
    //         spot1 = new THREE.SpotLight( 0xFFFFFF, 1 , 0);
    //         spot1.castShadow = this.castShadows;
    //         // spot1.shadowDarkness = 0.9;
    //         spot1.shadowMapWidth = 2048;
    //         spot1.shadowMapHeight = 2048;
    //         // spot1.shadowCameraVisible = false;
    //     } else {
    //         spot1 = new THREE.SpotLight( 0xFFFFFF);
    //     }
    //
    //     spot1.target.position.set( 0, 0, 0 );
    //     spot1.position.set( -100, 10, 0 );
    //
    //     this.scene.add(spot1);
    // }
    //
    // private updateScale() {
    //     const scaleDiameter = 12756 * 10; // 지구의 직경에서 10배를 하여 크기를 줄인다.
    //     const scaleDistance = Math.pow(10, 3) * 2; // Math.pow(10, 6) (원래대로는 10의 6승을 해 주어야 함)
    //     PlanetsInfo.sun.scales.radius = PlanetsInfo.sun.info.diameter / scaleDiameter;
    //     // diameter : km, distance: 60 (6승) km
    //     for (const planet of PlanetsInfo.planets) {
    //         planet.scales.radius = planet.info.diameter / scaleDiameter;
    //         // planet.scales.distance = planet.info.distance * Math.pow(10, 6) / scale;
    //         planet.scales.distance = planet.info.distance * scaleDistance / scaleDiameter;
    //
    //         for (const satellite of planet.satellites) {
    //             if (satellite.info) {
    //                 satellite.scales.radius = satellite.info.diameter / scaleDiameter;
    //                 satellite.scales.distance = satellite.info.distance * scaleDistance / scaleDiameter;
    //             }
    //         }
    //
    //         if (planet.ring) {
    //             // planet.ring.scale.inner = planet.ring.info.inner / (scaleDiameter / 2);
    //             // planet.ring.scale.outer = planet.ring.info.outer / (scaleDiameter / 2);
    //         }
    //     }
    //     // PlanetsInfo.sun.scales.radius = PlanetsInfo.sun.info.diameter / scale;
    // }
    // /** Updates the scene position of each planet given their order and visiblity flag.
    //  *
    //  */
    // private updatePlanetPositions() {
    //     // const x = PlanetsInfo.sun.scales[this.scaleBy] / 2.0;
    //     const x = PlanetsInfo.sun.scales.radius / 2.0;
    //     for (const planet of this.planets) {
    //         if (planet != null) {
    //             planet.position.x = planet.userData['scales'].distance * 5 + x;
    //         }
    //     }
    // }
    //
    // private setGridHelper() {
    //     const helper = new THREE.GridHelper( 1000, 40, 0x303030, 0x303030 );
    //     helper.position.y = -75;
    //     this.scene.add( helper );
    // }
    //
    // private setOrbitController() {
    //     this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    //     this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    //     this.controls.dampingFactor = 1;
    //     this.controls.minDistance = 1;
    //     this.controls.maxDistance = Infinity;
    //     this.controls.maxPolarAngle = Math.PI / 2; //
    //     this.controls.zoomSpeed = 0.5;
    // }
    //

    private render() {
        const timer = 0.0001 * Date.now();

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );

        this.camera.position.z = 5;

        // this.controls.update();
        // for (const planet of this.planets) {
        //     planet.rotation.y += 0.005;
        // }
        //
        //
        // for (const pivot of this.pivots) {
        //     const revolustionY = 1 / ( pivot.userData['scales'].revolution * 20000);
        //     pivot.rotation.y +=  revolustionY;
        // }
        // if (this.selectedPlanet) {
        //     const vector = new THREE.Vector3( 1, 0, 0 );
        //     const meshPos = this.selectedPlanet.getWorldPosition(vector);
        //
        //
        //     this.spaceship.position.x = meshPos.x;
        //     this.spaceship.position.y = meshPos.y;
        //     this.spaceship.position.z = meshPos.z;
        //
        //
        //     this.camera.lookAt(meshPos);
        //     this.camera.updateProjectionMatrix();
        // } else {
        //     const mesh = this.scene.getObjectByName('sun');
        //     const vector = new THREE.Vector3( 1, 0, 0 );
        //
        //     if (mesh) {
        //         const meshPos = mesh.getWorldPosition(vector);
        //
        //         this.spaceship.position.x = Math.sin( timer * 7 ) * 100;
        //         this.spaceship.position.z = Math.cos( timer * 3 ) * 400;
        //
        //         this.camera.lookAt(meshPos);
        //         this.camera.updateProjectionMatrix();
        //     }
        // }
        console.log('render');
        this.renderer.render( this.scene, this.camera );
    }


    // private render() {
    //     const timer = 0.0001 * Date.now();
    //     this.controls.update();
    //     for (const planet of this.planets) {
    //         planet.rotation.y += 0.005;
    //     }
    //
    //
    //     for (const pivot of this.pivots) {
    //         const revolustionY = 1 / ( pivot.userData['scales'].revolution * 20000);
    //         pivot.rotation.y +=  revolustionY;
    //     }
    //     if (this.selectedPlanet) {
    //         const vector = new THREE.Vector3( 1, 0, 0 );
    //         const meshPos = this.selectedPlanet.getWorldPosition(vector);
    //
    //
    //         this.spaceship.position.x = meshPos.x;
    //         this.spaceship.position.y = meshPos.y;
    //         this.spaceship.position.z = meshPos.z;
    //
    //
    //         this.camera.lookAt(meshPos);
    //         this.camera.updateProjectionMatrix();
    //     } else {
    //         const mesh = this.scene.getObjectByName('sun');
    //         const vector = new THREE.Vector3( 1, 0, 0 );
    //
    //         if (mesh) {
    //             const meshPos = mesh.getWorldPosition(vector);
    //
    //             this.spaceship.position.x = Math.sin( timer * 7 ) * 100;
    //             this.spaceship.position.z = Math.cos( timer * 3 ) * 400;
    //
    //             this.camera.lookAt(meshPos);
    //             this.camera.updateProjectionMatrix();
    //         }
    //     }
    //
    //     this.renderer.render( this.scene, this.camera );
    // }
    //
    private update = () => {
        console.log('update');
        this.render();
        requestAnimationFrame(this.update); // request next update
    }
    //
    // /** Creates a 3D object mesh using the specified definition. Will load the surface texture, along with
    //  * rings and moons, if present.
    //  *
    //  */
    // createMesh(def: any, x: number, y: number, lighted?: boolean) {
    //     const group = new THREE.Group();
    //
    //     // sun and planet 정의
    //     const texture = new THREE.TextureLoader().load( def.url );
    //     const geometry = new THREE.SphereGeometry( .5 * def.scales[this.scaleBy], 32, 32 );
    //     let material: THREE.MeshPhongMaterial | THREE.MeshBasicMaterial;
    //
    //     if (lighted) { // planets
    //         material = new THREE.MeshPhongMaterial(
    //             {
    //                 color: 0xDDDDDD,
    //                 shininess: 150,
    //                 specular: 0x000000,
    //                 map: texture
    //             });
    //     } else { // sun
    //         material = new THREE.MeshBasicMaterial({
    //             map: texture
    //         });
    //     }
    //
    //     const mesh = new THREE.Mesh( geometry, material );
    //     // mesh.position.set(new THREE.Vector3( x, y, 0 ));
    //     mesh.position.set(x, y, 0);
    //     mesh.name =  def.name;
    //
    //     if (lighted && this.castShadows && def.ring !== undefined) {
    //         mesh.castShadow = true;
    //         mesh.receiveShadow = true;
    //     }
    //
    //     group.add(mesh);
    //
    //     // ring에 대한 정의
    //     if (def.ring !== undefined) {
    //         const ringTexture = new THREE.TextureLoader().load( def.ring.url );
    //         const ringMaterial = new THREE.MeshPhongMaterial(
    //             {
    //                 color: 0xDDDDDD,
    //                 shininess: 150,
    //                 specular: 0x000000,
    //                 map: ringTexture,
    //                 transparent: true,
    //                 side: THREE.DoubleSide,
    //                 flatShading: true
    //             });
    //
    //         // const ringGeometry = new THREE.RingGeometry2( .5 * def.ring.inner, .5 * def.ring.outer, 180, 1, 0, Math.PI * 2);
    //         // RingGeometry(innerRadius : Float, outerRadius : Float, thetaSegments : Integer, phiSegments : Integer, thetaStart : Float, thetaLength : Float)
    //         const ringGeometry = this.RingGeometry2( def.ring.scale.inner, def.ring.scale.outer, 180, 1, 0, Math.PI * 2);
    //         // const ringGeometry = new THREE.RingGeometry( def.ring.scale.inner, def.ring.scale.outer, 180, 1, 0, Math.PI * 2);
    //         console.log('ringGeometry', ringGeometry);
    //         const ring = new THREE.Mesh( ringGeometry, ringMaterial );
    //         if (def.ring.rotation !== undefined) {
    //             ring.rotation.x = def.ring.rotation[0] * (Math.PI / 180);
    //             ring.rotation.y = def.ring.rotation[1] * (Math.PI / 180);
    //             ring.rotation.z = def.ring.rotation[2] * (Math.PI / 180);
    //         }
    //
    //         ring.position.set( x, y, 0 );
    //
    //         if (this.castShadows) {
    //             ring.castShadow = true;
    //             ring.receiveShadow = true;
    //         }
    //         group.add(ring);
    //     }
    //
    //     // 기타 행성에 대한 정의
    //     if (def.satellites !== undefined) {
    //         const marginX = def.scales[this.scaleBy] / 2.0;
    //         for (const satDef of def.satellites) {
    //             if (satDef !== null && satDef.scales) {
    //                 const satX = satDef.scales.distance * 800 + marginX + satDef.scales.radius * 10;
    //                 const sat = this.createMesh(satDef, satX, 0, lighted);
    //                 group.add(sat);
    //             }
    //         }
    //     }
    //     return group;
    // }
    //
    // private showInfo(name: string): void {
    //     if (name === 'sun') {
    //         this.planetInfo = PlanetsInfo.sun;
    //     } else if (name) {
    //         this.planetInfo = this.getPlanetInfo(name);
    //     } else {
    //         this.planetInfo = null;
    //     }
    // }
    //
    // /**
    //  * 선택된 행성의 정보를 리턴한다.
    //  */
    // private getPlanetInfo(name: string): any {
    //
    //     for (const planet of PlanetsInfo.planets) {
    //         if (planet.name === name) {
    //             //
    //             return planet;
    //         }
    //     }
    // }
    //
    // private onWindowResize() {
    //     this.sceneWidth = this.domContainer.nativeElement.offsetWidth;
    //     this.sceneHeight  = this.domContainer.nativeElement.offsetHeight;
    //     this.renderer.setSize(this.sceneWidth, this.sceneHeight);
    //     this.camera.aspect = this.sceneWidth / this.sceneHeight;
    //     this.camera.updateProjectionMatrix();
    // }
    //
    // public setPlanet(name: string) {
    //     this.selectedPlanetName = name;
    //     if (this.InfoState === 'inactive') {
    //         this.InfoState = 'active';
    //         this.showInfo(name);
    //     } else {
    //         this.InfoState = 'inactive';
    //         setTimeout(() => {
    //             this.InfoState = 'active';
    //             this.showInfo(name);
    //         }, 500);
    //     }
    //
    //     if (name === 'solarsystem') {
    //         this.camera.position.z = 1000; // 근/원 거리
    //         this.camera.position.y = 250;
    //         this.spaceship.add(this.camera);
    //         this.selectedPlanet = null;
    //         // this.selectedPlanet = Nullable<Event>;
    //     } else {
    //         this.selectedPlanet = this.scene.getObjectByName( this.selectedPlanetName );
    //
    //         this.camera.position.x = 5;
    //         this.camera.position.y = 0.1;
    //         this.camera.position.z = 0;
    //         switch (name) {
    //             case 'sun':
    //                 this.camera.position.z = 200;
    //                 break;
    //             case 'jupiter':
    //                 this.camera.position.z = 25;
    //                 break;
    //             case 'saturn':
    //                 this.camera.position.z = 25;
    //                 break;
    //             case 'uranus':
    //             case 'neptune':
    //                 this.camera.position.z = 5;
    //                 break;
    //         }
    //     }
    // }
    //
    // private RingGeometry2( innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number ) {
    //
    //     // THREE.Geometry.call( this );
    //     // const geometry = new THREE.Geometry();
    //     // const geometry = new THREE.SphereGeometry();
    //     const geometry = new THREE.BufferGeometry();
    //
    //     innerRadius = innerRadius || 0;
    //     outerRadius = outerRadius || 50;
    //
    //     thetaStart = thetaStart !== undefined ? thetaStart : 0;
    //     thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;
    //
    //     thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
    //     phiSegments = phiSegments !== undefined ? Math.max( 3, phiSegments ) : 8;
    //
    //     let i: number;
    //     let o: number;
    //     const uvs = [];
    //     const vertices = [];
    //     let radius = innerRadius;
    //     const radiusStep = ( ( outerRadius - innerRadius ) / phiSegments);
    //
    //
    //
    //     for ( i = 0; i <= phiSegments; i++) { // concentric circles inside ring
    //
    //         for ( o = 0; o <= thetaSegments; o++) { // number of segments per circle
    //
    //             // const vertex = new THREE.Vector3();
    //
    //             const x = radius * Math.cos( thetaStart + o / thetaSegments * thetaLength );
    //             const y = radius * Math.sin( thetaStart + o / thetaSegments * thetaLength );
    //             // console.log('vertex', vertex);
    //             // geometry.vertices.push( vertex );
    //             // vertices.push( new Float32Array ([vertex.x, vertex.y, vertex.z]) );
    //             vertices.push( x, y, 0 );
    //             // vertices.push( y );
    //             // vertices.push( 0 );
    //
    //             // console.log( [x, y, 0]);
    //             // console.log('vertices', vertices);
    //             geometry.setAttribute( 'normals', new THREE.Float32BufferAttribute( [x, y, 0], 3 ) );
    //
    //             uvs.push( new THREE.Vector2((i / phiSegments), ( y / radius + 1 ) / 2));
    //         }
    //
    //         radius += radiusStep;
    //
    //     }
    //
    //     // const vertices2 = new Float32Array(vertices );
    //     geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    //
    //     const n = new THREE.Vector3( 0, 0, 1 );
    //
    //     const normals = [];
    //     const uvss = [];
    //     for ( i = 0; i < phiSegments; i++) { // concentric circles inside ring
    //
    //         for ( o = 0; o <= thetaSegments; o++) { // number of segments per circle
    //
    //             let v1: number;
    //             let v2: number;
    //             let v3: number;
    //
    //             v1 = o + (thetaSegments * i) + i;
    //             v2 = o + (thetaSegments * i) + thetaSegments + i;
    //             v3 = o + (thetaSegments * i) + thetaSegments + 1 + i;
    //
    //             normals.push( v1, v2, v3);
    //             uvss.push(uvs[ v1 ], uvs[ v2 ], uvs[ v3 ]);
    //             // geometry.faces.push( new THREE.Face3( v1, v2, v3, [ n, n, n ] ) );
    //             // geometry.faceVertexUvs[ 0 ].push( [ uvs[ v1 ], uvs[ v2 ], uvs[ v3 ] ]);
    //
    //             v1 = o + (thetaSegments * i) + i;
    //             v2 = o + (thetaSegments * i) + thetaSegments + 1 + i;
    //             v3 = o + (thetaSegments * i) + 1 + i;
    //
    //             // geometry.faces.push( new THREE.Face3( v1, v2, v3, [ n, n, n ] ) );
    //             // geometry.faceVertexUvs[ 0 ].push( [ uvs[ v1 ], uvs[ v2 ], uvs[ v3 ] ]);
    //
    //         }
    //     }
    //
    //     geometry.setAttribute( 'normals', new THREE.Float32BufferAttribute( normals, 3 ) );
    //     geometry.setAttribute( 'normals', new THREE.Float32BufferAttribute( uvss, 3 ) );
    // //    geometry.computeCentroids();
    //     // geometry.computeFaceNormals();
    //
    //     geometry.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );
    //     return geometry;

    // }
}
