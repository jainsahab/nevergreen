import {
  BACKUP_ROOT,
  BackupState,
  getBackupDescription,
  getBackupId,
  getBackupUrl,
  reduce
} from '../../../src/client/backup/BackupReducer'
import {Actions} from '../../../src/client/Actions'
import {
  BackupLocation,
  backupSetDescription,
  backupSetId,
  backupSetUrl,
  configurationImported
} from '../../../src/client/backup/BackupActionCreators'
import {buildState, testReducer} from '../testHelpers'
import {State} from '../../../src/client/Reducer'
import {RecursivePartial} from '../../../src/client/common/Types'

const reducer = testReducer({
  [BACKUP_ROOT]: reduce
})

function state(existing?: RecursivePartial<BackupState>): State {
  return buildState({[BACKUP_ROOT]: existing})
}

it('should return the state unmodified for an unknown action', () => {
  const existingState = state()
  const newState = reducer(existingState, {type: 'not-a-real-action'})
  expect(newState).toEqual(existingState)
})

describe(Actions.CONFIGURATION_IMPORTED, () => {

  it('should merge the id', () => {
    const existingState = state()
    const action = configurationImported({[BACKUP_ROOT]: {github: {id: 'some-id'}}})
    const newState = reducer(existingState, action)
    expect(getBackupId(BackupLocation.GITHUB, newState)).toEqual('some-id')
  })

  it('should merge the description', () => {
    const existingState = state()
    const action = configurationImported({[BACKUP_ROOT]: {github: {description: 'some-description'}}})
    const newState = reducer(existingState, action)
    expect(getBackupDescription(BackupLocation.GITHUB, newState)).toEqual('some-description')
  })

  it('should handle no github data', () => {
    const existingState = state({github: {id: 'some-id', description: 'some-description'}})
    const action = configurationImported({})
    const newState = reducer(existingState, action)
    expect(getBackupId(BackupLocation.GITHUB, newState)).toEqual('some-id')
    expect(getBackupDescription(BackupLocation.GITHUB, newState)).toEqual('some-description')
  })

  it('should only merge for the correct backup location', () => {
    const existingState = state({github: {id: 'some-id'}})
    const action = configurationImported({[BACKUP_ROOT]: {github: {id: 'some-id'}}})
    const newState = reducer(existingState, action)
    expect(getBackupId(BackupLocation.GITLAB, newState)).toEqual('')
  })
})

describe(Actions.BACKUP_SET_DESCRIPTION, () => {

  it('should set the description property', () => {
    const existingState = state({github: {}})
    const action = backupSetDescription(BackupLocation.GITHUB, 'some-description')
    const newState = reducer(existingState, action)
    expect(getBackupDescription(BackupLocation.GITHUB, newState)).toEqual('some-description')
  })
})

describe(Actions.BACKUP_SET_ID, () => {

  it('should set the id property', () => {
    const existingState = state({github: {}})
    const action = backupSetId(BackupLocation.GITHUB, 'some-id')
    const newState = reducer(existingState, action)
    expect(getBackupId(BackupLocation.GITHUB, newState)).toEqual('some-id')
  })
})

describe(Actions.BACKUP_SET_URL, () => {

  it('should set the id property', () => {
    const existingState = state({github: {}})
    const action = backupSetUrl(BackupLocation.GITHUB, 'some-url')
    const newState = reducer(existingState, action)
    expect(getBackupUrl(BackupLocation.GITHUB, newState)).toEqual('some-url')
  })
})
