import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {TimingSettings} from './TimingSettings'
import {DisplaySettings} from './DisplaySettings'
import {AudioSettings} from './AudioSettings'
import {Title} from '../common/Title'
import {NotificationSettings} from './NotificationSettings'

export function Settings(props) {
  return (
    <Fragment>
      <Title>Settings</Title>
      <TimingSettings {...props}/>
      <DisplaySettings {...props}/>
      <NotificationSettings {...props}/>
      <AudioSettings {...props}/>
    </Fragment>
  )
}

Settings.propTypes = {
  showTrayName: PropTypes.bool.isRequired,
  showBrokenBuildTime: PropTypes.bool.isRequired,
  playBrokenBuildSoundFx: PropTypes.bool.isRequired,
  showBuildLabel: PropTypes.bool.isRequired,
  brokenBuildSoundFx: PropTypes.string,
  setShowBrokenBuildTime: PropTypes.func.isRequired,
  setShowTrayName: PropTypes.func.isRequired,
  setPlayBrokenBuildSoundFx: PropTypes.func.isRequired,
  setBrokenBuildSoundFx: PropTypes.func.isRequired,
  refreshTime: PropTypes.number.isRequired,
  setRefreshTime: PropTypes.func.isRequired,
  setShowBuildLabel: PropTypes.func.isRequired,
  systemNotificationsSupported: PropTypes.bool.isRequired,
  showSystemNotifications: PropTypes.bool.isRequired,
  setShowSystemNotifications: PropTypes.func.isRequired
}
