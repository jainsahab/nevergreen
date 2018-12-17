import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import {GistIdInput} from '../../GistIdInput'
import {GitHubHelp} from './GitHubHelp'
import {WithHelp} from '../../../common/ContextualHelp'
import styles from './github.scss'
import {PrimaryButton} from '../../../common/forms/Button'
import {iCloudDownload} from '../../../common/fonts/Icons'

export function GitHub({gistId, gitHubSetGistId, loaded, restoreFromGitHub}) {
  const disabled = !loaded

  return (
    <Fragment>
      <WithHelp title='Import from GitHub'
                help={<GitHubHelp/>}>
        <GistIdInput key={gistId}
                     gistId={gistId}
                     setGistId={gitHubSetGistId}
                     disabled={disabled}/>
      </WithHelp>
      <PrimaryButton className={styles.import}
                     onClick={restoreFromGitHub}
                     disabled={disabled}
                     icon={iCloudDownload}>
        import
      </PrimaryButton>
    </Fragment>
  )
}

GitHub.propTypes = {
  loaded: PropTypes.bool,
  restoreFromGitHub: PropTypes.func.isRequired,
  gitHubSetGistId: PropTypes.func.isRequired,
  gistId: PropTypes.string.isRequired
}
