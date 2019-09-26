import {now} from '../common/DateTime'
import {AuthTypes, generateRandomName, Tray} from '../domain/Tray'
import {Actions} from '../Actions'
import {Project} from '../domain/Project'
import {Action} from 'redux'

export interface ActionTrayAdded extends Action<Actions.TRAY_ADDED> {
  readonly trayId: string;
  readonly data: Tray;
}

export interface ActionTrayUpdate extends Action<Actions.TRAY_UPDATED> {
  readonly trayId: string;
  readonly data: Partial<Tray>;
}

export interface ActionRemoveTray extends Action<Actions.TRAY_REMOVED> {
  readonly trayId: string;
}

export interface ActionProjectsFetched extends Action<Actions.PROJECTS_FETCHED> {
  readonly trayId: string;
  readonly data: ReadonlyArray<Project>;
  readonly serverType: string;
  readonly timestamp: string;
  readonly includeNew: boolean;
}

export interface ActionSelectProject extends Action<Actions.PROJECT_SELECTED> {
  readonly trayId: string;
  readonly projectId: string;
  readonly selected: boolean;
}

export function trayAdded(
  trayId: string,
  url: string,
  authType: AuthTypes,
  username: string,
  password: string,
  accessToken: string
): ActionTrayAdded {
  return {
    type: Actions.TRAY_ADDED,
    trayId,
    data: {
      trayId,
      url,
      authType,
      username,
      password,
      accessToken,
      name: generateRandomName(),
      includeNew: true,
      serverType: ''
    }
  }
}

export function trayUpdated(trayId: string, data: Partial<Tray>): ActionTrayUpdate {
  return {type: Actions.TRAY_UPDATED, trayId, data}
}

export function trayRemoved(trayId: string): ActionRemoveTray {
  return {type: Actions.TRAY_REMOVED, trayId}
}

export function projectsFetched(trayId: string, projects: ReadonlyArray<Project>, includeNew: boolean): ActionProjectsFetched {
  const first = projects[0]
  const serverType = first ? first.serverType : ''

  return {
    type: Actions.PROJECTS_FETCHED,
    trayId,
    data: projects,
    serverType,
    timestamp: now(),
    includeNew
  }
}

export function projectSelected(trayId: string, projectId: string, selected: boolean): ActionSelectProject {
  return {type: Actions.PROJECT_SELECTED, trayId, projectId, selected}
}
