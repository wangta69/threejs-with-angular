# ThreeJs with Angular
https://threejs.org/docs/#manual/ko/introduction/Installation

## 인스톨 three.js
```
npm i three
npm i @types/three
```

## 기본적이 구성하기
```
renderer
Scene
camera
```
```
## shadow 표현시 주의점
```
1. WebGLReneder에서 shadow 사용을 활성화 해줘야 한다.
renderer.shadowMap.enabled = true;
2. light object와 shadow를 유발시키는 object에 castShadow를 활성화 해줘야 한다.
Object.castShadow = true
3. shadow가 표현될 물체에 receiveShadow를 활성화 해줘야 한다.
ReceiveObject.receiveShadow = true;
```
## 용어
https://inhibitor1217.github.io/2019/04/20/webgl-vao.html
- Vertex: 모든 도형은 그 표면을 이루는 꼭짓점(vertex)들과 두 꼭짓점이 연결된 변(edge), 그리고 변들로 이루어진 면(face)으로 이루어져 있습니다. 컴퓨터 그래픽스에서는 도형을 vertex들과 vertex가 서로 연결된 face로 표현합니다.
- Vertex Attributes: 각 vertex가 가지고 있는 성질(attribute)를 의미합니다. 대표적인 attriubute로는 위치, 색깔, normal(방향)가 있습니다.
- 모델(Model): Vertex, edge, face로 이루어진 도형을 모델이라고 합니다.
- Buffer Object
모델에 속한 vertex의 데이터를 GPU에 전송하기 위해서는 어떻게 해야 할까요? Buffer Object(BO)는 GPU에 보낼 수 있는 여러 가지 형식의 데이터 중 하나입니다. BO는 특별한 규칙이 없는 배열입니다. 다른 함수들을 통해 이 배열을 이용하여 실제로 어떻게 작업을 수행할지 결정할 수 있습니다. 이 부분에 관해서는 뒤에서 더 설명하도록 하겠습니다.
- Segment: 라인
두개의 삼각형이 모여 사각형을 만든다.
```
const data = new Float32Array([
    -0.5,  0.5, // 왼쪽 위
    -0.5, -0.5, // 왼쪽 아래
     0.5, -0.5, // 오른쪽 아래
    -0.5,  0.5, // 왼쪽 위
     0.5, -0.5, // 오른쪽 아래
     0.5,  0.5  // 오른쪽 위
]);
```
https://sbcode.net/threejs/geometry-to-buffergeometry/