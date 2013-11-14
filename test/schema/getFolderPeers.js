var schema = {
  id        : 'getFolderPeers',
  type      : 'array',
  items: {
    title: 'Peer',
    type: 'object',
    properties: {
      connection: {
        type: 'string',
        enum: ['direct', 'relay']
      },
      download: {
        type: 'number'
      },
      id: {
        type: 'string'
      },
      name: {
        type: 'string'
      },
      synced: {
        type: 'number'
      },
      upload: {
        type: 'number'
      }
    },
    required: ['connection', 'download', 'id', 'name', 'synced', 'upload']
  }
};

module.exports = schema;
