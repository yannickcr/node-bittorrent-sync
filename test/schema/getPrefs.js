var schema = {
  id        : 'getPrefs',
  type      : 'object',
  properties: {
    device_name: {
      type: 'string'
    },
    disk_low_priority: {
      type: 'number',
      enum: [0, 1]
    },
    download_limit: {
      type: 'number'
    },
    folder_rescan_interval: {
      type: 'string'
    },
    lan_encrypt_data: {
      type: 'number',
      enum: [0, 1]
    },
    lan_use_tcp: {
      type: 'number',
      enum: [0, 1]
    },
    lang: {
      type: 'number'
    },
    listening_port: {
      type: 'number'
    },
    max_file_size_diff_for_patching: {
      type: 'string'
    },
    max_file_size_for_versioning: {
      type: 'string'
    },
    rate_limit_local_peers: {
      type: 'number',
      enum: [0, 1]
    },
    recv_buf_size: {
      type: 'string'
    },
    send_buf_size: {
      type: 'string'
    },
    sync_max_time_diff: {
      type: 'string'
    },
    sync_trash_ttl: {
      type: 'string'
    },
    upload_limit: {
      type: 'number'
    },
    use_upnp: {
      type: 'number',
      enum: [0, 1]
    }
  },
  required  : [
    'device_name',                  'disk_low_priority',      'download_limit', 'folder_rescan_interval',
    'lan_encrypt_data',             'lan_use_tcp', 'lang',    'listening_port', 'max_file_size_diff_for_patching',
    'max_file_size_for_versioning', 'rate_limit_local_peers', 'recv_buf_size',  'send_buf_size',
    'sync_max_time_diff',           'sync_trash_ttl',         'upload_limit',   'use_upnp'
  ],
};

module.exports = schema;
