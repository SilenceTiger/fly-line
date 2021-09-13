# Three Fly Line
## 1.安装
`npm install fly-line`

`or`

`yarn add fly-line`

## 2.示例
[3D场景应用](http://localhost:1234/#/3d)
[2D场景应用](http://localhost:1234/#/2d)
[地图中的应用](http://localhost:1234/#/map)

`代码见example`

## 3.使用
```
import FlyLine, { mapping2to3 } from 'fly-line'

let lines: FlyLine[] = []

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

// animate 中

lines.forEach(flyLine => {
  flyLine.animate()
})

```

## 4.参数
let line = new FlyLine(points: any[], color: THREE.Vector3, scene: any, speed?: number, length?: number, size?: number, discardOpacity?: number, showLine?: boolean): FlyLine

| 参数    | 说明  | 
|  ----  | ----  | 
| points  | 描述line的点 |
| color  | 颜色 Vector3 | 
| scene  | three中的场景 | 
| speed  | 速度 | 
| length  | 彗星尾巴的长度 | 
| size | 大小 |
| discardOpacity | 舍弃点的临界值，默认0.2 |
| showLine | 是否显示背景线 |

## 5.方法
`show()`

`hide()`

`dispose()`

