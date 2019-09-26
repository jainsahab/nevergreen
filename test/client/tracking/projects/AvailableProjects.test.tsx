import React from 'react'
import {noop} from 'lodash'
import userEvent from '@testing-library/user-event'
import {waitForDomChange} from '@testing-library/react'
import {buildApiProject, buildProject, buildTray, render} from '../../testHelpers'
import {fakeRequest} from '../../../../src/client/gateways/Gateway'
import {AvailableProjects} from '../../../../src/client/tracking/projects/AvailableProjects'
import {TRAYS_ROOT} from '../../../../src/client/tracking/TraysReducer'
import {PROJECTS_ROOT} from '../../../../src/client/tracking/ProjectsReducer'
import {SELECTED_ROOT} from '../../../../src/client/tracking/SelectedReducer'
import * as ProjectsGateway from '../../../../src/client/gateways/ProjectsGateway'

describe('<AvailableProjects/>', () => {

  const DEFAULT_PROPS = {
    index: 1,
    tray: buildTray(),
    requiresRefresh: false,
    setRequiresRefresh: noop
  }

  beforeEach(() => {
    jest.spyOn(ProjectsGateway, 'fetchAll').mockResolvedValue(fakeRequest([]))
  })

  it('should show errors returned while refreshing', async () => {
    jest.spyOn(ProjectsGateway, 'fetchAll').mockResolvedValue(fakeRequest([
      buildApiProject({isError: true, errorMessage: 'some-error'})
    ]))
    const tray = buildTray({trayId: 'trayId'})
    const state = {
      [TRAYS_ROOT]: {
        trayId: tray
      }
    }

    const {queryByText, getByText} = render(<AvailableProjects {...DEFAULT_PROPS} tray={tray}/>, state)
    userEvent.click(getByText('refresh'))

    await waitForDomChange()

    expect(queryByText('some-error')).toBeInTheDocument()
  })

  it('should show a warning if there are no projects', () => {
    const tray = buildTray({trayId: 'trayId'})
    const state = {
      [TRAYS_ROOT]: {
        trayId: tray
      },
      [PROJECTS_ROOT]: {
        trayId: {}
      },
      [SELECTED_ROOT]: {
        trayId: []
      }
    }
    const {queryByText} = render(<AvailableProjects {...DEFAULT_PROPS} tray={tray}/>, state)
    expect(queryByText('No projects fetched, please refresh')).toBeInTheDocument()
  })

  it('should show a warning if no projects match the filter', async () => {
    const tray = buildTray({trayId: 'trayId'})
    const state = {
      [TRAYS_ROOT]: {
        trayId: tray
      },
      [PROJECTS_ROOT]: {
        trayId: {
          projectId: buildProject({
            projectId: 'projectId',
            name: 'foo'
          })
        }
      },
      [SELECTED_ROOT]: {
        trayId: []
      }
    }

    const {getByLabelText, queryByText} = render(<AvailableProjects {...DEFAULT_PROPS} tray={tray}/>, state)
    await userEvent.type(getByLabelText('filter'), 'bar')

    expect(queryByText('No matching projects, please update your filter')).toBeInTheDocument()
  })

  it('should show an error if the filter is invalid', async () => {
    const tray = buildTray({trayId: 'trayId'})
    const state = {
      [TRAYS_ROOT]: {
        trayId: tray
      },
      [PROJECTS_ROOT]: {
        trayId: {
          projectId: buildProject({
            projectId: 'projectId'
          })
        }
      },
      [SELECTED_ROOT]: {
        trayId: []
      }
    }
    const {getByLabelText, queryByText} = render(<AvailableProjects {...DEFAULT_PROPS} tray={tray}/>, state)
    await userEvent.type(getByLabelText('filter'), '?')
    expect(queryByText(/^Project filter not applied/)).toBeInTheDocument()
  })

  describe('accessibility', () => {

    it('should announce projects if a user refreshes', () => {
      const tray = buildTray({trayId: 'trayId'})
      const state = {
        [TRAYS_ROOT]: {
          trayId: tray
        },
        [PROJECTS_ROOT]: {
          trayId: {
            projectId: buildProject({
              projectId: 'projectId'
            })
          }
        },
        [SELECTED_ROOT]: {
          trayId: []
        }
      }
      const {getByTestId} = render(<AvailableProjects {...DEFAULT_PROPS} tray={tray}/>, state)
      expect(getByTestId('available-projects-list')).toHaveAttribute('aria-live', 'polite')
    })

    // This is because we first mark removed projects by disabling the checkbox and adding a removed label.
    // The user would need to refresh again to actually remove the project checkbox from the DOM, at which
    // point they should already know the project has been removed and thus it doesn't need to be announced
    it('should only announce project additions', () => {
      const tray = buildTray({trayId: 'trayId'})
      const state = {
        [TRAYS_ROOT]: {
          trayId: tray
        },
        [PROJECTS_ROOT]: {
          trayId: {
            projectId: buildProject({
              projectId: 'projectId'
            })
          }
        },
        [SELECTED_ROOT]: {
          trayId: []
        }
      }
      const {getByTestId} = render(<AvailableProjects {...DEFAULT_PROPS} tray={tray}/>, state)
      expect(getByTestId('available-projects-list')).toHaveAttribute('aria-relevant', 'additions')
    })
  })
})
