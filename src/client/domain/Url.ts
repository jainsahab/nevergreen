import {isBlank, notEmpty} from '../common/Utils'

const SCHEME_REGEX = /^[a-z0-9+.-]+:/i

export function hasScheme(url: string): boolean {
  return !isBlank(url) && notEmpty(SCHEME_REGEX.exec(url))
}

export function removeScheme(url: string): string {
  return url.replace(SCHEME_REGEX, '')
}


export function ensureHasScheme(url: string): string {
  if (hasScheme(url)) {
    return url
  } else if (url.startsWith('//')) {
    return `http:${url}`
  } else {
    return `http://${url}`
  }
}
