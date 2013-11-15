var schema = {
  id        : 'shutdown',
  type      : 'object',
  properties: {
    error: {
      type: 'number',
      enum: [0, 1]
    }
  },
  required  : ['error']
};

module.exports = schema;
