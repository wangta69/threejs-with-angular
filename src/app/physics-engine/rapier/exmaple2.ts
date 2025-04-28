// https://sbcode.net/threejs/physics-rapier/
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import RAPIER from '@dimforge/rapier3d-compat'

@Component({
selector: 'app-root',
templateUrl: '../../basic/scene.html',
})
export class RapierSample2Component implements OnInit, OnDestroy, AfterViewInit { // , AfterViewInit
  @ViewChild('domContainer', {static: true}) domContainer!: ElementRef;
  private sceneWidth!: number;
  private sceneHeight!: number;

  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private controls: any;

  private clock = new THREE.Clock();
  private delta!: number;
  private raycaster = new THREE.Raycaster()
  private mouse = new THREE.Vector2()
  private world!:RAPIER.World;
  private stats!:Stats;
  private dynamicBodies!: [THREE.Object3D, RAPIER.RigidBody][];
  private cubeMesh!:THREE.Mesh;

  private car!:Car;

  private rapierDebugRenderer:any;

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

    this.rapierDebugRenderer = new RapierDebugRenderer(this.scene, this.world)

    this.setCamera(); // 카메라 설정
    this.setRenderer(); // render 구성

    this.setLight(); //  조명 설정
    this.setOrbitController(); // controls 구
    this.setGridHelper();


    this.createMesh();


    
 
   


    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
    
    const gui = new GUI()
    gui.add(this.rapierDebugRenderer, 'enabled').name('Rapier Degug Renderer')
    
    const physicsFolder = gui.addFolder('Physics')
    physicsFolder.add(this.world.gravity, 'x', -10.0, 10.0, 0.1)
    physicsFolder.add(this.world.gravity, 'y', -10.0, 10.0, 0.1)
    physicsFolder.add(this.world.gravity, 'z', -10.0, 10.0, 0.1)
    this.clock = new THREE.Clock();

    this.update(); // 화면을 계속해서 새로이 그린다.
  }

  ngOnDestroy() {
  }

  private createMesh() {
    // Cuboid Collider
    const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
    cubeMesh.castShadow = true
    this.scene.add(cubeMesh)
    const cubeBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(-5, 5, 0).setCanSleep(false))
    const cubeShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(1).setRestitution(0.5)
    this.world.createCollider(cubeShape, cubeBody)
    this.dynamicBodies.push([cubeMesh, cubeBody])

    // Ball Collider
    const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshNormalMaterial())
    sphereMesh.castShadow = true
    this.scene.add(sphereMesh)
    const sphereBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(-2.5, 5, 0).setCanSleep(false))
    const sphereShape = RAPIER.ColliderDesc.ball(1).setMass(1).setRestitution(0.5)
    this.world.createCollider(sphereShape, sphereBody)
    this.dynamicBodies.push([sphereMesh, sphereBody])

    // Cylinder Collider
    const cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 16), new THREE.MeshNormalMaterial())
    cylinderMesh.castShadow = true
    this.scene.add(cylinderMesh)
    const cylinderBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 5, 0).setCanSleep(false))
    const cylinderShape = RAPIER.ColliderDesc.cylinder(1, 1).setMass(1).setRestitution(0.5)
    this.world.createCollider(cylinderShape, cylinderBody)
    this.dynamicBodies.push([cylinderMesh, cylinderBody])

    // ConvexHull Collider
    const icosahedronMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshNormalMaterial())
    icosahedronMesh.castShadow = true
    this.scene.add(icosahedronMesh)
    const icosahedronBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(2.5, 5, 0).setCanSleep(false))
    const points = new Float32Array((icosahedronMesh.geometry.attributes as any).position.array);
   

    const icosahedronShape = (RAPIER.ColliderDesc as any).convexHull(points).setMass(1).setRestitution(0.5)
    this.world.createCollider(icosahedronShape, icosahedronBody)
    this.dynamicBodies.push([icosahedronMesh, icosahedronBody])


    // Trimesh Collider
    const torusKnotMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(), new THREE.MeshNormalMaterial())
    torusKnotMesh.castShadow = true
    this.scene.add(torusKnotMesh)
    const torusKnotBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(5, 5, 0))
    const vertices = new Float32Array((torusKnotMesh.geometry.attributes as any).position.array)
    let indices = new Uint32Array((torusKnotMesh.geometry.index as any).array)
    const torusKnotShape = RAPIER.ColliderDesc.trimesh(vertices, indices).setMass(1).setRestitution(0.5)
    this.world.createCollider(torusKnotShape, torusKnotBody)
    this.dynamicBodies.push([torusKnotMesh, torusKnotBody])

    // the floor (using a cuboid)
    const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(50, 1, 50), new THREE.MeshPhongMaterial())
    floorMesh.receiveShadow = true
    floorMesh.position.y = -1
    this.scene.add(floorMesh)
    const floorBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1, 0))
    const floorShape = RAPIER.ColliderDesc.cuboid(25, 0.5, 25)
    this.world.createCollider(floorShape, floorBody)

    // creating a shape from a loaded geometry. (Using OBJLoader)
    new OBJLoader().loadAsync('/assets/suzanne.obj').then((object) => {
        //console.log(object)
        this.scene.add(object)
        const suzanneMesh: any = object.getObjectByName('Suzanne')                
        suzanneMesh.material = new THREE.MeshNormalMaterial()
        suzanneMesh.castShadow = true

        const suzanneBody = this.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(-1, 10, 0).setCanSleep(false))
        const points = new Float32Array(suzanneMesh.geometry.attributes.position.array)
        const suzanneShape = (RAPIER.ColliderDesc as any).convexHull(points).setMass(1).setRestitution(0.5)
        this.world.createCollider(suzanneShape, suzanneBody)
        this.dynamicBodies.push([suzanneMesh, suzanneBody])
    })

    this.car = new Car(this, [0, 2, 0])

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
  }



  private setRenderer() {
    this.renderer = new THREE.WebGLRenderer({antialias: true}); // renderer with transparent backdrop
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.VSMShadowMap
    this.domContainer.nativeElement.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })

    this.renderer.domElement.addEventListener('click', (e) => {
      this.mouse.set((e.clientX / this.renderer.domElement.clientWidth) * 2 - 1, -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1)

      this.raycaster.setFromCamera(this.mouse, this.camera)

      const intersects = this.raycaster.intersectObjects(
        this.dynamicBodies.flatMap((a) => a[0]),
          false
      )

      if (intersects.length) {
        this.dynamicBodies.forEach((b) => {
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
    const aspect = window.innerWidth / window.innerHeight;  // [Float] Camera frustum aspect ratio, usually the canvas width / canvas height. Default is 1 (square canvas).

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
    light1.angle = Math.PI / 1.8
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
    this.delta = this.clock.getDelta()
    this.world.timestep = Math.min(this.delta, 0.01)
    this.world.step()

    for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
      this.dynamicBodies[i][0].position.copy(this.dynamicBodies[i][1].translation())
      this.dynamicBodies[i][0].quaternion.copy(this.dynamicBodies[i][1].rotation())
    }

    this.car.update()

    this.rapierDebugRenderer.update()

    this.controls.update()

    this.renderer.render(this.scene, this.camera)

    this.stats.update()
  }

  private update = () => {
    this.render();
    requestAnimationFrame(this.update); // request next update
  }
}


class RapierDebugRenderer {
  mesh
  world
  enabled = true

  constructor(scene:THREE.Scene, world:RAPIER.World) {
      this.world = world
      this.mesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true }))
      this.mesh.frustumCulled = false
      scene.add(this.mesh)
  }

  update() {
      if (this.enabled) {
          const { vertices, colors } = this.world.debugRender()
          this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
          this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
          this.mesh.visible = true
      } else {
          this.mesh.visible = false
      }
  }
}


class Car {
  dynamicBodies: any = []
  private game;
  constructor(game: any, position:number[] = [0, 0, 0]) {
    this.game = game;
      new GLTFLoader().loadAsync('/assets/sedanSports.glb').then((gltf) => {
          //console.log(gltf.scene)

          const carMesh:any = gltf.scene.getObjectByName('body');
          carMesh.position.set(0, 0, 0)
          carMesh.traverse((o: any) => {
              o.castShadow = true
          })

          const wheelBLMesh: any = gltf.scene.getObjectByName('wheel_backLeft')
          const wheelBRMesh: any = gltf.scene.getObjectByName('wheel_backRight')
          const wheelFLMesh: any = gltf.scene.getObjectByName('wheel_frontLeft')
          const wheelFRMesh: any = gltf.scene.getObjectByName('wheel_frontRight')
          wheelBLMesh.position.set(0, 0, 0)
          wheelBRMesh.position.set(0, 0, 0)
          wheelFLMesh.position.set(0, 0, 0)
          wheelFRMesh.position.set(0, 0, 0)

          //scene.add(gltf.scene)
          this.game.scene.add(carMesh, wheelBLMesh, wheelBRMesh, wheelFLMesh, wheelFRMesh)

          // const newObject = [...position];
          const carBody = this.game.world.createRigidBody(
              RAPIER.RigidBodyDesc.dynamic()
                  .setTranslation(position[0], position[1], position[2])
                  // .setTranslation(...position)
                  // .setTranslation.apply(null, position)
                  .setCanSleep(false)
          )
          const wheelBLBody = this.game.world.createRigidBody(
              RAPIER.RigidBodyDesc.dynamic()
                  .setTranslation(-1 + position[0], 1 + position[1], 1 + position[2])
                  .setCanSleep(false)
          )
          const wheelBRBody = this.game.world.createRigidBody(
              RAPIER.RigidBodyDesc.dynamic()
                  .setTranslation(1 + position[0], 1 + position[1], 1 + position[2])
                  .setCanSleep(false)
          )
          const wheelFLBody = this.game.world.createRigidBody(
              RAPIER.RigidBodyDesc.dynamic()
                  .setTranslation(-1 + position[0], 1 + position[1], -1 + position[2])
                  .setCanSleep(false)
          )
          const wheelFRBody = this.game.world.createRigidBody(
              RAPIER.RigidBodyDesc.dynamic()
                  .setTranslation(1 + position[0], 1 + position[1], -1 + position[2])
                  .setCanSleep(false)
          )

          // create a convexhull from all meshes in the carMesh group
          const v = new THREE.Vector3()
          let positions:any[] = []
          carMesh.updateMatrixWorld(true) // ensure world matrix is up to date
          carMesh.traverse((o: any) => {
              if (o.type === 'Mesh') {
                  const positionAttribute = o.geometry.getAttribute('position')
                  for (let i = 0, l = positionAttribute.count; i < l; i++) {
                      v.fromBufferAttribute(positionAttribute, i)
                      v.applyMatrix4(o.parent.matrixWorld)
                      positions.push(...v)
                  }
              }
          })

          // create shapes for carBody and wheelBodies
          const carShape = (RAPIER.ColliderDesc as any).convexHull(new Float32Array(positions)).setMass(1).setRestitution(0.5)
          const wheelBLShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
              .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2))
              .setTranslation(-0.2, 0, 0)
              .setRestitution(0.5)
          const wheelBRShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
              .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
              .setTranslation(0.2, 0, 0)
              .setRestitution(0.5)
          const wheelFLShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
              .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
              .setTranslation(-0.2, 0, 0)
              .setRestitution(0.5)
          const wheelFRShape = RAPIER.ColliderDesc.cylinder(0.1, 0.3)
              .setRotation(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
              .setTranslation(0.2, 0, 0)
              .setRestitution(0.5)

          // create world collider
          this.game.world.createCollider(carShape, carBody)
          this.game.world.createCollider(wheelBLShape, wheelBLBody)
          this.game.world.createCollider(wheelBRShape, wheelBRBody)
          this.game.world.createCollider(wheelFLShape, wheelFLBody)
          this.game.world.createCollider(wheelFRShape, wheelFRBody)

          // attach wheels to car using Rapier revolute joints
          this.game.world.createImpulseJoint(
              RAPIER.JointData.revolute(new RAPIER.Vector3(-0.55, 0, 0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(-1, 0, 0)),
              carBody,
              wheelBLBody,
              true
          )
          this.game.world.createImpulseJoint(
              RAPIER.JointData.revolute(new RAPIER.Vector3(0.55, 0, 0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(1, 0, 0)),
              carBody,
              wheelBRBody,
              true
          )
          this.game.world.createImpulseJoint(
              RAPIER.JointData.revolute(new RAPIER.Vector3(-0.55, 0, -0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(-1, 0, 0)),
              carBody,
              wheelFLBody,
              true
          )
          this.game.world.createImpulseJoint(
              RAPIER.JointData.revolute(new RAPIER.Vector3(0.55, 0, -0.63), new RAPIER.Vector3(0, 0, 0), new RAPIER.Vector3(1, 0, 0)),
              carBody,
              wheelFRBody,
              true
          )

          // update local dynamicBodies so mesh positions and quaternions are updated with the physics world info
          this.dynamicBodies.push([carMesh, carBody])
          this.dynamicBodies.push([wheelBLMesh, wheelBLBody])
          this.dynamicBodies.push([wheelBRMesh, wheelBRBody])
          this.dynamicBodies.push([wheelFLMesh, wheelFLBody])
          this.dynamicBodies.push([wheelFRMesh, wheelFRBody])
      })
  }

  update() {
      for (let i = 0, n = this.dynamicBodies.length; i < n; i++) {
          this.dynamicBodies[i][0].position.copy(this.dynamicBodies[i][1].translation())
          this.dynamicBodies[i][0].quaternion.copy(this.dynamicBodies[i][1].rotation())
      }
  }
}