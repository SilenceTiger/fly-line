import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { HashRouter, Route, Link, Switch, Redirect } from 'react-router-dom'
import Scene2D from './pages/2d'
import Scene3D from './pages/3d'
import Map3D from './pages/map'
import './index.css'

const Menu = () => {
  return (
    <div className="menu-container">
      <div className="title">Menu</div>
      <Link to="/3d" target="_blank">
        1.3D场景应用
      </Link>
      <Link to="/2d" target="_blank">
        2.2D场景应用
      </Link>
      <Link to="/map" target="_blank">
        3.3D地图应用
      </Link>
    </div>
  )
}

const App = () => {
  return (
    <div className="container">
      <HashRouter basename="/">
        <Switch>
          <Route path="/menu" component={Menu} />
          <Route path="/2d" component={Scene2D} />
          <Route path="/3d" component={Scene3D} />
          <Route path="/map" component={Map3D} />
          <Route path="/" render={() => <Redirect to="/menu" />} />
        </Switch>
      </HashRouter>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
