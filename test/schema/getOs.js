var schema = {
  id        : 'getOs',
  type      : 'object',
  properties: {
    os: {
      type: 'string'
    }
  },
  required  : ['os']
};

module.exports = schema;
