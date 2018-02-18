export interface Config {
  app: string
  buildDirectory: string
  server: string
  tempDirectory: string
}

export const schema = {
  properties: {
    app: {
      required: true,
      type: 'string',
    },
    buildDirectory: {
      required: true,
      type: 'string',
    },
    server: {
      required: true,
      type: 'string',
    },
    tempDirectory: {
      required: false,
      type: 'string',
    },
  },
  required: true,
  type: 'object',
}
