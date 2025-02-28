import * as THREE from 'three';
export default class Cube { 
  constructor() {
  }


  public cube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00} );
    return new THREE.Mesh( geometry, material );
  }

  public colorCube() {
    // 큐버를 만들고 scene에 추가한다.
    const geometry = new THREE.BoxGeometry();
    const positionAttribute = geometry.getAttribute('position');
    const material = new THREE.MeshBasicMaterial( { vertexColors: true} );

    const colors = [];
    for (var i = 0; i < positionAttribute.count; i += 2)
    {
      const color = {
        h: (1 / (positionAttribute.count)) * i,
        s: 0.5,
        l: 0.5
      };
      colors.push(color.h, color.s, color.l, color.h, color.s, color.l);
    }

    const colorAttribute = new THREE.Float32BufferAttribute(colors, 3);
    geometry.setAttribute('color', colorAttribute);

    return new THREE.Mesh( geometry, material );
  }

  


}