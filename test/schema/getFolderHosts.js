var schema = {
  id        : 'getFolderHosts',
  type: 'object',
  properties: {
    hosts: {
      type: 'array',
      items: {
        title: 'Host',
        type: 'string',
        pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|)){4}:[0-9]{1,5}$/
      }
    }
  },
  hosts: ['hosts']
};

module.exports = schema;
