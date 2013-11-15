var schema = {
  id        : 'getVersion',
  type      : 'object',
  properties: {
    version: {
      type: 'string'
    }
  },
  required  : ['version']
};

module.exports = schema;
