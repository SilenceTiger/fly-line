import * as React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import SimpleScene from 'simple-scene-react';
import Star from './Star';
import Human from './Human';
import FlyLine from '../../../src/index';

const stars = [
  new Star(
    'Earth',
    require('./texture/earth.jpg'),
    require('./texture/earth-high.jpg'),
    300,
    [0, -300, 600],
    0
  ),
  new Star(
    'Moon',
    require('./texture/moon.jpg'),
    require('./texture/moon-high.jpg'),
    150,
    [600, 400, -1000],
    0
  ),
];

const humans = [
  new Human('Me', require('./texture/me.png'), [130, -20, 500]),
  new Human('嫦娥', require('./texture/ce.png'), [620, 610, -1000]),
];

const ImageLoader = new THREE.ImageLoader();
const GLBLoader = new GLTFLoader();

const rampaging = require('./glb/rampaging.glb');
let animations: any;
let mixer: any;

let lines_1: FlyLine[] = []; // 一级攻击
let lines_2: FlyLine[] = []; // 二级攻击
let lines_3: FlyLine[] = []; // 三级攻击

const generatePoints = (
  axis: THREE.Vector3,
  angle: number,
  offset: THREE.Vector3,
  r: number,
  num: number
) => {
  let arr: THREE.Vector3[] = [];
  for (let i = 0; i <= num; i++) {
    let cita = (2 * Math.PI * i) / num;
    let p = new THREE.Vector3(r * Math.cos(cita), r * Math.sin(cita), 0);
    p.applyAxisAngle(axis, angle);
    p.add(offset);
    arr.push(p);
  }
  return arr;
};

const addStars = async (scene: THREE.Scene) => {
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    let sphereGeo = new THREE.SphereGeometry(star.raduis, 50, 50); //创建一个球体几何对象
    let img = await ImageLoader.load(star.image);
    let texture = new THREE.Texture(img);
    texture.needsUpdate = true;
    let imgH = await ImageLoader.load(star.highImage);
    let highTexture = new THREE.Texture(imgH);
    let material = new THREE.MeshStandardMaterial({
      map: texture,
      displacementMap: highTexture,
      displacementScale: i === 0 ? 40 : 5,
      displacementBias: 10,
      // wireframe: true,
      // side: THREE.DoubleSide,
    });
    (material.displacementMap as any).needsUpdate = true;
    let sphereMesh = new THREE.Mesh(sphereGeo, material);
    sphereMesh.position.set(
      star.position[0],
      star.position[1],
      star.position[2]
    ); //几何体中心位置
    sphereMesh.name = star.name;
    star.mesh = sphereMesh;
    if (i === 0) {
      sphereMesh.rotation.z = Math.PI / 6;
      sphereMesh.rotation.y = (3 * Math.PI) / 2;
    }
    scene.add(sphereMesh);
  }
};

const addHumans = async (scene: THREE.Scene) => {
  for (let i = 0; i < humans.length; i++) {
    let human = humans[i];

    let img = await ImageLoader.load(human.image);
    let texture = new THREE.Texture(img);
    texture.needsUpdate = true;

    let spriteMaterial = new THREE.SpriteMaterial({
      // color: 0xffffff, //设置精灵矩形区域颜色
      rotation: i === 0 ? Math.PI / 6 : 2 * Math.PI, //旋转精灵对象45度，弧度值
      map: texture, //设置精灵纹理贴图
    });

    let mesh = new THREE.Sprite(spriteMaterial);
    mesh.position.set(human.position[0], human.position[1], human.position[2]); //几何体中心位置
    mesh.name = human.name;
    human.mesh = mesh;
    mesh.scale.set(100, 100, 1);
    scene.add(mesh);
  }
};

const addRampaging = async (scene: THREE.Scene) => {
  GLBLoader.load(rampaging, gltf => {
    let modal = gltf.scene;
    modal.scale.set(50, 50, 50);
    mixer = new THREE.AnimationMixer(modal); // 指定对象
    animations = gltf.animations;
    mixer.clipAction(animations[1]).play();
    modal.rotation.y = Math.PI / 2;
    modal.position.set(-80, 0, 600);
    scene.add(modal);
  });
};

const addLevelLines = (
  scene: THREE.Scene,
  from: THREE.Vector3,
  to: THREE.Vector3,
  axis: THREE.Vector3,
  cita: number,
  offset: THREE.Vector3,
  r: number,
  count: number,
  size: number,
  lines: FlyLine[],
  level: number
) => {
  let constrolPoints = generatePoints(axis, -cita, offset, r, count);
  for (let i = 0; i < constrolPoints.length; i++) {
    let _line = new THREE.QuadraticBezierCurve3(from, constrolPoints[i], to);
    let points = _line.getPoints(1000);
    let flyLine = new FlyLine(
      points,
      new THREE.Vector3(Math.random(), Math.random(), Math.random()),
      scene,
      1,
      0.1,
      size,
      -1
    );
    if (level !== 1) {
      flyLine.hide();
    }
    lines.push(flyLine);
  }
};

const addLines = (scene: THREE.Scene) => {
  let from = new THREE.Vector3(
    humans[0].position[0] + 30,
    humans[0].position[1] + 40,
    humans[0].position[2]
  );
  let to = new THREE.Vector3(
    humans[1].position[0],
    humans[1].position[1],
    humans[1].position[2]
  );
  let mid = new THREE.Vector3(
    (from.x + to.x) / 2,
    (from.y + to.y) / 2,
    (from.z + to.z) / 2
  );
  let p = from.clone().sub(to);
  let _p = new THREE.Vector3(0, 0, 1);
  let cita = p.angleTo(_p);
  let axis = p
    .clone()
    .cross(_p)
    .normalize();

  addLevelLines(scene, from, to, axis, cita, mid, 0, 1, 4, lines_1, 1);
  addLevelLines(scene, from, to, axis, cita, mid, 400, 20, 8, lines_2, 2);
  addLevelLines(scene, from, to, axis, cita, mid, 800, 50, 12, lines_3, 3);
};

const addCamera = (
  target: SimpleScene,
  scene: THREE.Scene,
  width: number,
  height: number
) => {
  target.camera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
  target.camera.position.set(300, 0, 1000);
  target.camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
};

const addLight = (scene: THREE.Scene) => {
  // 默认存在环境光  new THREE.AmbientLight(0xffffff, 0.8);
  // 若不想使用可以 useDefaultLight = false
  // 点光源
  let point = new THREE.PointLight(0xedf069, 2);
  point.position.set(0, -400, 1000);
  scene.add(point);
};

const ThreeStar = () => {
  const [visile1, setVisible1] = React.useState(true);
  const [visile2, setVisible2] = React.useState(false);
  const [visile3, setVisible3] = React.useState(false);

  const beforeRender = async (
    target: any,
    scene: THREE.Scene,
    camera: THREE.Camera,
    width: number,
    height: number
  ) => {
    addStars(scene);
    addHumans(scene);
    addRampaging(scene);
    addLines(scene);
    // if useDefaultCamera = false 则需自己定义摄像头
    addCamera(target, scene, width, height);
    // 补充light
    addLight(scene);
  };

  const animate = (target: any, clock: THREE.Clock) => {
    let delta = clock.getDelta();
    if (mixer) {
      mixer.update(delta);
    }
    lines_1.forEach(flyLine => {
      flyLine.animate();
    });
    lines_2.forEach(flyLine => {
      flyLine.animate();
    });
    lines_3.forEach(flyLine => {
      flyLine.animate();
    });
    // 自转
    stars.forEach(star => {
      if (star.mesh) {
        star.mesh.rotation.y += delta;
      }
    });
  };

  const onClick = (target: any, scene: THREE.Scene) => {
    console.log(target?.object.name);
  };

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <div
        className="btns"
        style={{
          position: 'absolute',
        }}
      >
        <div>
          {visile1 ? (
            <button
              onClick={() => {
                lines_1.forEach(flyLine => {
                  flyLine.hide();
                });
                setVisible1(v => !v);
              }}
            >
              一级攻击关闭
            </button>
          ) : (
            <button
              onClick={() => {
                lines_1.forEach(flyLine => {
                  flyLine.show();
                });
                setVisible1(v => !v);
              }}
            >
              一级攻击开启
            </button>
          )}

          {visile2 ? (
            <button
              onClick={() => {
                lines_2.forEach(flyLine => {
                  flyLine.hide();
                });
                setVisible2(v => !v);
              }}
            >
              二级攻击关闭
            </button>
          ) : (
            <button
              onClick={() => {
                lines_2.forEach(flyLine => {
                  flyLine.show();
                });
                setVisible2(v => !v);
              }}
            >
              二级攻击开启
            </button>
          )}

          {visile3 ? (
            <button
              onClick={() => {
                lines_3.forEach(flyLine => {
                  flyLine.hide();
                });
                setVisible3(v => !v);
              }}
            >
              三级攻击关闭
            </button>
          ) : (
            <button
              onClick={() => {
                lines_3.forEach(flyLine => {
                  flyLine.show();
                });
                setVisible3(v => !v);
              }}
            >
              三级攻击开启
            </button>
          )}
        </div>
        <div>
          {['run', 'bit', 'roar', 'tail', 'idke'].map((item, index) => (
            <button
              key={item}
              onClick={() => {
                if (mixer) {
                  mixer.stopAllAction();
                  mixer.clipAction(animations[index]).play();
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <SimpleScene
        style={{
          background: '#000000',
        }}
        showAxisHelper={false}
        resizeEnable={true}
        beforeRender={beforeRender}
        animate={animate}
        useDefaultLight={true}
        useDefaultCamera={false}
        onClick={onClick}
      />
    </div>
  );
};

export default ThreeStar;
