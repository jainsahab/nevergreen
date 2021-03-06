import {Actions} from '../Actions'
import {Action} from 'redux'
import {Configuration} from '../configuration/Configuration'

export enum BackupLocation {
  GITHUB = 'github',
  GITLAB = 'gitlab'
}

export interface ActionConfigurationImported extends Action<Actions.CONFIGURATION_IMPORTED> {
  readonly configuration: Configuration;
}

export interface ActionBackupSetId extends Action<Actions.BACKUP_SET_ID> {
  readonly location: BackupLocation;
  readonly id: string;
}

export interface ActionBackupSetDescription extends Action<Actions.BACKUP_SET_DESCRIPTION> {
  readonly location: BackupLocation;
  readonly description: string;
}

export interface ActionBackupSetUrl extends Action<Actions.BACKUP_SET_URL> {
  readonly location: BackupLocation;
  readonly url: string;
}

export function configurationImported(configuration: Configuration): ActionConfigurationImported {
  return {type: Actions.CONFIGURATION_IMPORTED, configuration}
}

export function backupSetId(location: BackupLocation, id: string): ActionBackupSetId {
  return {type: Actions.BACKUP_SET_ID, location, id}
}

export function backupSetDescription(location: BackupLocation, description: string): ActionBackupSetDescription {
  return {type: Actions.BACKUP_SET_DESCRIPTION, location, description}
}

export function backupSetUrl(location: BackupLocation, url: string): ActionBackupSetUrl {
  return {type: Actions.BACKUP_SET_URL, location, url}
}
