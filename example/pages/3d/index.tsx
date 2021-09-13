import React = require('react')
import SimpleScene from 'simple-scene-react'
import * as THREE from 'three'
import FlyLine from '../../../src/index'
import './style.css'

let cube: THREE.Mesh
let sphere: THREE.Mesh

let lines: FlyLine[] = []

const cubePostion = new THREE.Vector3(-200, 100, -100)
const spPosition = new THREE.Vector3(200, -100, 100)

const addCamera = (target: SimpleScene, scene: THREE.Scene, width: number, height: number) => {
  target.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -1000, 1000)
  target.camera.position.set(0, 50, 50)
}

const addLight = (scene: THREE.Scene) => {
  let point = new THREE.PointLight(0xedf069, 2)
  point.position.set(0, 0, 0)
  scene.add(point)
}

const addMesh = (scene: THREE.Scene) => {
  const cubeGeo = new THREE.BoxGeometry(100, 100, 100)
  const spGeo = new THREE.SphereGeometry(50, 50, 50)
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  cube = new THREE.Mesh(cubeGeo, material)
  cube.position.set(cubePostion.x, cubePostion.y, cubePostion.z)
  sphere = new THREE.Mesh(spGeo, material)
  sphere.position.set(spPosition.x, spPosition.y, spPosition.z)
  scene.add(cube)
  scene.add(sphere)
}

const addLine = (scene: THREE.Scene) => {
  for (let i = -5; i <= 5; i++) {
    let _line = new THREE.QuadraticBezierCurve3(
      cubePostion,
      new THREE.Vector3(
        (cubePostion.x + spPosition.x) / 2,
        (cubePostion.y + spPosition.y) / 2 + i * 50,
        (cubePostion.z + spPosition.z) / 2,
      ),
      spPosition,
    )
    let points = _line.getPoints(1000)
    lines.push(
      new FlyLine(points, new THREE.Vector3(Math.random(), Math.random(), Math.random()), scene, 1, 0.1, 4, -1),
    )
  }
  for (let i = -5; i <= 5; i++) {
    let _line = new THREE.QuadraticBezierCurve3(
      cubePostion,
      new THREE.Vector3(
        (cubePostion.x + spPosition.x) / 2,
        (cubePostion.y + spPosition.y) / 2,
        (cubePostion.z + spPosition.z) / 2 + i * 100,
      ),
      spPosition,
    )
    let points = _line.getPoints(1000)
    lines.push(
      new FlyLine(points, new THREE.Vector3(Math.random(), Math.random(), Math.random()), scene, 1, 0.1, 4, -1),
    )
  }
  for (let i = -5; i <= 5; i++) {
    let _line = new THREE.QuadraticBezierCurve3(
      cubePostion,
      new THREE.Vector3(
        (cubePostion.x + spPosition.x) / 2 + i * 200,
        (cubePostion.y + spPosition.y) / 2,
        (cubePostion.z + spPosition.z) / 2,
      ),
      spPosition,
    )
    let points = _line.getPoints(1000)
    lines.push(
      new FlyLine(points, new THREE.Vector3(Math.random(), Math.random(), Math.random()), scene, 1, 0.1, 4, -1),
    )
  }
}

const Scene3D = () => {
  const beforeRender = async (target: any, scene: THREE.Scene, camera: THREE.Camera, width: number, height: number) => {
    addCamera(target, scene, width, height)
    addLight(scene)
    addMesh(scene)
    addLine(scene)
  }

  const animate = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    sphere.rotation.z += 0.01
    lines.forEach(flyLine => {
      flyLine.animate()
    })
  }

  return (
    <div className="container-3d">
      <div className="btns">
        <button
          onClick={() => {
            lines.forEach(flyLine => {
              flyLine.hide()
            })
          }}>
          隐藏
        </button>
        <button
          onClick={() => {
            lines.forEach(flyLine => {
              flyLine.show()
            })
          }}>
          显示
        </button>
      </div>
      <SimpleScene
        className="simple-scene"
        showAxisHelper={false}
        beforeRender={beforeRender}
        animate={animate}
        useDefaultCamera={false}
      />
    </div>
  )
}

export default Scene3D
