var schema = {
  id        : 'getFolderPrefs',
  type      : 'object',
  properties: {
    search_lan: {
      type: 'number',
      enum: [0, 1]
    },
    selective_sync: {
      type: 'number',
      enum: [0, 1]
    },
    use_dht: {
      type: 'number',
      enum: [0, 1]
    },
    use_hosts: {
      type: 'number',
      enum: [0, 1]
    },
    use_relay_server: {
      type: 'number',
      enum: [0, 1]
    },
    use_sync_trash: {
      type: 'number',
      enum: [0, 1]
    },
    use_tracker: {
      type: 'number',
      enum: [0, 1]
    }
  }
};

module.exports = schema;
