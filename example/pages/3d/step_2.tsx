import React = require('react')
import SimpleScene from 'simple-scene-react'
import * as THREE from 'three'
import './style.css'

let cube: THREE.Mesh
let sphere: THREE.Mesh

const addLight = (scene: THREE.Scene) => {
  let point = new THREE.PointLight(0xedf069, 2)
  point.position.set(200, 200, 0)
  scene.add(point)
}

const addMesh = (scene: THREE.Scene) => {
  const cubeGeo = new THREE.BoxGeometry(100, 100, 100)
  const spGeo = new THREE.SphereGeometry(50, 50, 50)
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  cube = new THREE.Mesh(cubeGeo, material)
  cube.position.set(0, 50, -50)
  sphere = new THREE.Mesh(spGeo, material)
  cube.position.set(50, -50, 50)
  scene.add(cube)
  scene.add(sphere)
}

const Scene3D = () => {
  const beforeRender = async (target: any, scene: THREE.Scene, camera: THREE.Camera, width: number, height: number) => {
    addLight(scene)
    addMesh(scene)
  }

  const animate = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }

  return <SimpleScene className="container-3d" showAxisHelper={true} beforeRender={beforeRender} animate={animate} />
}

export default Scene3D