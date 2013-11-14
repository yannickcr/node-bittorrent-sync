var schema = {
  id        : 'getFolders',
  type      : 'array',
  items: {
    title: 'Folder',
    type: 'object',
    properties: {
      dir: {
        type: 'string'
      },
      error: {
        type: 'number'
      },
      files: {
        type: 'number'
      },
      indexing: {
        type: 'number'
      },
      secret: {
        type: 'string'
      },
      size: {
        type: 'number'
      },
      type: {
        type: 'string',
        enum: ['read_only', 'read_write']
      }
    },
    required: ['dir', 'error', 'files', 'indexing', 'secret', 'size', 'type']
  }
};

module.exports = schema;
