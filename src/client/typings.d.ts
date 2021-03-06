declare module '*.scss' {
  const classes: Record<string, string>
  // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
  export default classes
}

declare module '*.txt' {
  const value: string
  // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
  export default value
}

declare module '*.png' {
  const value: string
  // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
  export default value
}

declare module '*.mp3' {
  const value: string
  // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
  export default value
}

declare module 'project-name-generator' {
  export function generator(): {
    spaced: string;
  }

  // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
  export default generator
}
