
export type Metadata = {
  sid?: string
  type: 'application' | 'plugin' | 'library'
  name: string
  namespace: string
  nsi: string
  description: string
  version: string
  favicon: string
  categories: string[]
  etoken?: string
  sizes?: {
    download?: number
    installation?: number
  }
  runscript?: {
    [index: string]: {
      workspace?: string
      autoload?: boolean
    }
  }
  resource?: {
    dependencies?: string[]
    permissions?: {
      scope?: (string | { type: string, access: string })[]
    }
    services?: { [index: string]: string[] }
  }
  plugins?: {
    [index: string]: Metadata
  }
  libraries?: {
    [index: string]: Metadata
  }
  author: {
    type: string
    name: string
  }
  configs?: { [index: string]: any }
}

export type ShellOptions = {
  cwd?: string
  stdio?: 'pipe'
  shell?: string
}
export type CPMProgressWatcher = ( error: Error | string | boolean, data?: any, byte?: string | number ) => void
export type CPRAccess = {
  source: string
  apiversion?: number
  username?: string
  token?: string
}
export type CPMOptions = {
  cpr: CPRAccess
  cwd: string
  manager?: 'cpm' | 'npm' | 'yarn'
  debug?: boolean
  watcher: CPMProgressWatcher
}