import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import _ from 'lodash'
import {registerServiceWorker} from './ServiceWorker'
import {Header} from './header/Header'
import {Footer} from './footer/Footer'
import {Timer} from './common/Timer'
import NotificationContainer from './notification/NotificationContainer'
import version from '../../resources/version.txt'
import styles from './nevergreen.scss'

const ONE_SECONDS = 1000
const THREE_SECONDS = 3 * 1000
const TWENTY_FOUR_HOURS = 24 * 60 * 60

function blurActive() {
  const active = document.activeElement
  if (active) {
    active.blur()
  }
}

export class Nevergreen extends Component {

  constructor(props) {
    super(props)
    this.state = {fullScreenTimer: null}
    this.disableFullScreen = _.throttle(this.disableFullScreen, ONE_SECONDS, {trailing: false}).bind(this)
  }

  checkVersion = () => {
    this.props.checkForNewVersion(version, window.location.hostname)
  }

  componentDidMount() {
    this.props.initalise()

    Mousetrap.bindGlobal('esc', blurActive)
    Mousetrap.bind('?', () => {
      this.props.keyboardShortcut(true)
      this.props.history.push('help')
    })

    registerServiceWorker(this.props.notify)
  }

  componentWillUnmount() {
    Mousetrap.unbind(['?', 'esc'])
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fullScreenRequested !== this.props.fullScreenRequested) {
      this.props.enableFullScreen(this.props.fullScreenRequested)
      if (!this.props.fullScreenRequested) {
        clearTimeout(this.state.fullScreenTimer)
      }
    }
  }

  render() {
    const {loaded, isFullScreen, children} = this.props

    return (
      <div className={styles.nevergreen}
           onMouseMove={this.disableFullScreen}
           aria-busy={!loaded}>
        <Timer onTrigger={this.checkVersion} interval={TWENTY_FOUR_HOURS}/>
        <Header fullScreen={isFullScreen}/>
        <NotificationContainer/>
        {loaded && <main className={styles.main}>{children}</main>}
        <Footer fullScreen={isFullScreen}/>
      </div>
    )
  }

  disableFullScreen() {
    clearTimeout(this.state.fullScreenTimer)

    if (this.props.isFullScreen) {
      this.props.enableFullScreen(false)
    }

    if (this.props.fullScreenRequested) {
      const enableFullScreen = () => {
        this.props.enableFullScreen(true)
      }
      const fullScreenTimer = setTimeout(enableFullScreen, THREE_SECONDS)
      this.setState({fullScreenTimer})
    }
  }
}

Nevergreen.propTypes = {
  children: PropTypes.node.isRequired,
  loaded: PropTypes.bool.isRequired,
  initalise: PropTypes.func.isRequired,
  keyboardShortcut: PropTypes.func.isRequired,
  checkForNewVersion: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isFullScreen: PropTypes.bool,
  fullScreenRequested: PropTypes.bool,
  enableFullScreen: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired
}

export default Nevergreen
