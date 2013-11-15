var schema = {
  id        : 'getSpeed',
  type      : 'object',
  properties: {
    download: {
      type: 'number'
    },
    upload: {
      type: 'number'
    }
  },
  required  : ['download', 'upload']
};

module.exports = schema;
