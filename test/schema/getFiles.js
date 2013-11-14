var schema = {
  id        : 'getFiles',
  type      : 'array',
  items: {
    title: 'File',
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      state: {
        type: 'string'
      },
      type: {
        type: 'string',
        enum: ['file', 'folder']
      },
      have_pieces: {
        type: 'number'
      },
      size: {
        type: 'number'
      },
      total_pieces: {
        type: 'number'
      }
    },
    required: ['name', 'state', 'type']
  }
};

module.exports = schema;
