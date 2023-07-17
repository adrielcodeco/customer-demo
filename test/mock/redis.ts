export const redisModuleMock = {
  get: (key: string) => {
    if (key === 'customer:11111') {
      throw new Error('Cache out of service')
    }
    return Promise.resolve(
      key === 'customer:12345'
        ? JSON.stringify({
            id: '12345',
            name: 'John Doe',
            document: 69050007015,
          })
        : undefined,
    )
  },
  set: (key, data) => {
    const json = JSON.parse(data)
    if (json.document === 23750787050) {
      throw new Error('Cache out of service')
    }
    return Promise.resolve('OK')
  },
  exists: key => {
    if (key === 'customer:00000') {
      return Promise.resolve(0)
    }
    return Promise.resolve(1)
  },
}
