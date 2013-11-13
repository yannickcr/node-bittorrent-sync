var schema = {
  id        : 'getOs',
  type      : 'object',
  required  : ['os'],
  properties: {
    os: {
      type: 'string'
    }
  }
};

module.exports = schema;
