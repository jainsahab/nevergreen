import {getMigrations} from './migrations'
import format from 'date-fns/format'
import {info} from '../common/Logger'
import {UntrustedData} from './LocalRepository'
import {get, has, isNil, set, unset} from 'lodash'
import {APPLIED_MIGRATIONS_ROOT, AppliedMigration} from './MigrationsReducer'

export type Migration = (data: UntrustedData) => void

export function migrate(data: UntrustedData): void {
  if (!has(data, APPLIED_MIGRATIONS_ROOT)) {
    data[APPLIED_MIGRATIONS_ROOT] = []
  }

  const appliedMigrations = data[APPLIED_MIGRATIONS_ROOT] as AppliedMigration[]

  const migrations = getMigrations()

  Object.keys(migrations)
    .sort((a, b) => a.localeCompare(b))
    .forEach((id) => {
      info(`Checking if migration [${id}] has been applied...`)

      const appliedMigration = appliedMigrations.find((m) => m.id === id)

      if (isNil(appliedMigration)) {
        info(`Migration [${id}] not yet applied!`)

        migrations[id](data)

        const timestamp = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSXXX')
        appliedMigrations.push({id, timestamp})

        info(`Migration [${id}] successfully applied at ${timestamp}`)
      } else {
        info(`Migration [${id}] already applied on ${appliedMigration.timestamp}`)
      }
    })
}

export function moveData(untrustedData: UntrustedData, fromPath: string, toPath: string): UntrustedData {
  if (has(untrustedData, fromPath)) {
    const dataToMove = get(untrustedData, fromPath)
    set(untrustedData, toPath, dataToMove)
    unset(untrustedData, fromPath)
  }
  return untrustedData
}