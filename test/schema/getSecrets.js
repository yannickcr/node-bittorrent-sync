var schema = {
  id        : 'getSecrets',
  type      : 'object',
  properties: {
    read_only: {
      type: 'string'
    },
    read_write: {
      type: 'string'
    },
    encryption: {
      type: 'string'
    }
  },
  required: ['read_only', 'read_write']
};

module.exports = schema;
