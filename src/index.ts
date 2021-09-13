import * as THREE from 'three'

export const Vector3toRgb = (v: THREE.Vector3) => {
  return `rgb(${parseInt(v.x * 255 + '')},${parseInt(v.y * 255 + '')},${parseInt(v.z * 255 + '')})`
}

export const mapping2to3 = (left: number, top: number, w: number, h: number) => {
  return new THREE.Vector3(left - w / 2, h / 2 - top, 0)
}

export default class FlyLine {
  points: any[]
  color: THREE.Vector3
  speed: number
  commonUniforms: any = {
    u_time: { value: 0.0 },
  }
  lineMaterial: any
  _lineMaterial: any
  lineMesh: any
  _lineMesh: any
  scene: THREE.Scene
  length: number
  size: number
  discardOpacity: number
  showLine: boolean
  constructor(
    points: any[],
    color: THREE.Vector3,
    scene: any,
    speed = 1.0,
    length = 0.1,
    size = 3.0,
    discardOpacity = 0.2,
    showLine = true,
  ) {
    this.points = points
    this.color = color
    this.scene = scene
    this.speed = speed
    this.length = length
    this.size = size
    this.discardOpacity = discardOpacity
    this.showLine = showLine
    this.init()
  }
  init() {
    let geometry = new THREE.BufferGeometry()
    geometry.setFromPoints(this.points)
    if (this.showLine) {
      this._lineMaterial = new THREE.LineBasicMaterial({
        color: Vector3toRgb(this.color),
      })
      this._lineMesh = new THREE.Line(geometry, this._lineMaterial)
      this.scene.add(this._lineMesh)
    }
    let length = this.points.length
    let percents = new Float32Array(length)
    for (let i = 0; i < this.points.length; i += 1) {
      percents[i] = i / length
    }
    geometry.setAttribute('percent', new THREE.BufferAttribute(percents, 1))
    this.lineMaterial = this.initLineMaterial()
    this.lineMesh = new THREE.Points(geometry, this.lineMaterial)
    this.scene.add(this.lineMesh)
  }
  initLineMaterial() {
    let singleUniforms = {
      u_time: this.commonUniforms.u_time,
      number: { type: 'f', value: 1.0 },
      speed: { type: 'f', value: this.speed },
      length: { type: 'f', value: this.length },
      size: { type: 'f', value: this.size },
      color: { type: 'v3', value: this.color },
      discard_opacity: { type: 'f', value: this.discardOpacity },
    }
    const vertexShader = ` 
        varying vec2 vUv;
        attribute float percent;
        uniform float u_time;
        uniform float number;
        uniform float speed;
        uniform float length;
        varying float opacity;
        uniform float size;
        void main() {
          vUv = uv;
          float l = clamp(1.0-length,0.0,1.0);//空白部分长度
          gl_PointSize = clamp(fract(percent*number + l - u_time*number*speed)-l ,0.0,1.0) * size * (1.0/length);
          opacity = gl_PointSize/size;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`
    const fragmentShader = ` 
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying float opacity;
        uniform vec3 color;
        uniform float discard_opacity;
        void main(){
          if(opacity <= discard_opacity){
            discard;
          }
          gl_FragColor = vec4(color,1.0);
        }`
    const lineMaterial = new THREE.ShaderMaterial({
      uniforms: singleUniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
    return lineMaterial
  }
  drawLine() {
    const geo = new THREE.BufferGeometry()
    geo.setFromPoints(this.points)
    const mat = new THREE.LineBasicMaterial({ color: Vector3toRgb(this.color) })
    const line = new THREE.Line(geo, mat)
    this.scene.add(line)
  }
  animate() {
    this.commonUniforms.u_time.value += 0.01
  }
  hide() {
    this.lineMesh.visible = false
    if (this._lineMesh) {
      this._lineMesh.visible = false
    }
  }
  show() {
    this.lineMesh.visible = true
    if (this._lineMesh) {
      this._lineMesh.visible = true
    }
  }
  dispose() {
    this.lineMaterial.dispose()
    this.lineMesh.dispose()
    this.lineMesh.parant.remove(this.lineMesh)
    this.lineMesh = null

    if (this._lineMesh) {
      this._lineMaterial.dispose()
      this._lineMesh.dispose()
      this._lineMesh.parant.remove(this._lineMesh)
      this._lineMesh = null
    }
  }
}
