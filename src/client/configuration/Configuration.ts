import validateConfiguration from './ValidateConfiguration'
import {cloneDeep, isString} from 'lodash'
import {RecursivePartial} from '../common/Types'
import {State} from '../Reducer'
import {fromJson, toJson} from '../common/Json'
import {migrate} from './Migrate'
import {UntrustedData} from './LocalRepository'
import {Either, left, right} from 'fp-ts/lib/Either'
import {errorMessage} from '../common/Utils'

export interface Configuration extends RecursivePartial<State> {
}

export const schema: Readonly<Record<string, unknown>> = validateConfiguration.schema

// ValidateConfiguration is generated using ajv-pack which is why it has a strange signature
function validateAndFilter(data: UntrustedData): Either<ReadonlyArray<string>, Configuration> {
  // Mutates the given object to filter unknown properties, and returns a boolean whether valid or not
  if (validateConfiguration(data)) {
    return right(data)
  } else {
    // If not valid, sets an errors property (even functions are objects in JS...)
    return left(validateConfiguration.errors.map((error) => `${error.dataPath} ${error.message}`))
  }
}

export function toConfiguration(raw: string | Readonly<UntrustedData>): Either<ReadonlyArray<string>, Configuration> {
  try {
    const data = isString(raw)
      ? fromJson(raw)
      : cloneDeep(raw)
    migrate(data)
    return validateAndFilter(data)
  } catch (error) {
    return left([errorMessage(error)])
  }
}

export function getConfiguration(state: State): string {
  return toJson(state)
}
