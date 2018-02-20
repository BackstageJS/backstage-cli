declare module '*package.json' {
  interface PackageJSON {
    version: string
  }

  const value: PackageJSON
  export = value
}
