import React = require('react')
import SimpleScene from 'simple-scene-react'
import * as THREE from 'three'
import FlyLine, { mapping2to3 } from '../../../src/index'
import './style.css'

let lines: FlyLine[] = []

const ITEM_WIDTH = 200
const ITEM_HEIGHT = 200
const MARGIN = 100
const PADDING = 100

const persons = [
  {
    id: 1,
    image: require('./images/uv-ai.jpg'),
    left: MARGIN,
    top: MARGIN,
  },
  {
    id: 2,
    image: require('./images/uv-chen.jpg'),
    left: MARGIN + PADDING + ITEM_WIDTH,
    top: MARGIN,
  },
  {
    id: 3,
    image: require('./images/uv-feng.jpg'),
    left: MARGIN + 2 * (PADDING + ITEM_WIDTH),
    top: MARGIN,
  },
  {
    id: 4,
    image: require('./images/uv-gao.jpg'),
    left: MARGIN,
    top: MARGIN + ITEM_HEIGHT + PADDING,
  },
  {
    id: 5,
    image: require('./images/uv-ge.jpg'),
    left: MARGIN + (PADDING + ITEM_WIDTH),
    top: MARGIN + ITEM_HEIGHT + PADDING,
  },
  {
    id: 6,
    image: require('./images/uv-niu.jpg'),
    left: MARGIN + 2 * (PADDING + ITEM_WIDTH),
    top: MARGIN + ITEM_HEIGHT + PADDING,
  },
]

const attacks = [
  [1, 6],
  [1, 4],
  [1, 2],
  [5, 2],
  [4, 3],
  [6, 1],
]

const getPersonById = (id: number) => {
  return persons.find(p => p.id === id)
}

const getLinePoints = (from: any, to: any, width: number, height: number) => {
  const arr: THREE.Vector3[] = []
  if (to[1] < from[1] || to[0] < from[0]) {
    arr.push(
      mapping2to3(from[0], from[1], width, height),
      mapping2to3(from[0], from[1] + PADDING / 2, width, height),
      mapping2to3(from[0] + PADDING / 2 + ITEM_WIDTH / 2, from[1] + PADDING / 2, width, height),
      mapping2to3(from[0] + PADDING / 2 + ITEM_WIDTH / 2, to[1] - PADDING / 2, width, height),
      mapping2to3(to[0], to[1] - PADDING / 2, width, height),
      mapping2to3(to[0], to[1], width, height),
    )
  } else {
    arr.push(
      mapping2to3(from[0], from[1], width, height),
      mapping2to3(from[0], from[1] + PADDING / 2, width, height),
      mapping2to3(to[0], to[1] - PADDING / 2, width, height),
      mapping2to3(to[0], to[1], width, height),
    )
  }
  const _lines: THREE.LineCurve3[] = []

  arr.reduce((pre, cur) => {
    if (pre) _lines.push(new THREE.LineCurve3(pre, cur))
    return cur
  }, null)

  const density = 1
  let points: THREE.Vector3[] = []
  _lines.forEach(line => {
    const pts = line.getPoints(line.getLength() * density)
    points = points.concat(pts)
  })
  return points
}

const addLine = (scene: THREE.Scene, width: number, height: number) => {
  attacks.forEach(a => {
    let from: any = getPersonById(a[0])
    let to: any = getPersonById(a[1])
    let _from = [from.left + ITEM_WIDTH / 2, from.top + ITEM_HEIGHT]
    let _to = [to.left + ITEM_WIDTH / 2, to.top]
    let points = getLinePoints(_from, _to, width, height)
    lines.push(
      new FlyLine(points, new THREE.Vector3(Math.random(), Math.random(), Math.random()), scene, 1, 0.1, 4, -1),
    )
  })
}

const addCamera = (target: SimpleScene, scene: THREE.Scene, width: number, height: number) => {
  target.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -1000, 1000)
  target.camera.position.set(0, 0, 100)
}

const Scene3D = () => {
  const beforeRender = async (target: any, scene: THREE.Scene, camera: THREE.Camera, width: number, height: number) => {
    addCamera(target, scene, width, height)
    addLine(scene, width, height)
  }

  const animate = () => {
    lines.forEach(flyLine => {
      flyLine.animate()
    })
  }

  return (
    <div className="container-2d">
      {persons.map(p => (
        <div
          className="person-item"
          key={p.id}
          style={{
            left: p.left,
            top: p.top,
          }}>
          <img src={p.image} alt="" />
        </div>
      ))}

      <SimpleScene
        showAxisHelper={false}
        beforeRender={beforeRender}
        animate={animate}
        useDefaultCamera={false}
        orbitControlsDisable={true}
      />
    </div>
  )
}

export default Scene3D
