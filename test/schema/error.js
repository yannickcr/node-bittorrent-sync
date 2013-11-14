var schema = {
  id        : 'error',
  type      : 'object',
  properties: {
    error: {
      type: 'number'
    },
    message: {
      type: 'string'
    }
  },
  required: ['error', 'message']
};

module.exports = schema;
