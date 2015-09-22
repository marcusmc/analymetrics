var DropboxFileRecord = Backbone.Model.extend({
  getPathForDisplay: function() {
    return this.get('payloads')['path']
  },
  getForRender: function() {
    return {
      path: this.getPathForDisplay(),
      size: filesize(this.get('size_in_bytes')),
      type: this.get('payloads')['mime_type']
    }
  }
});

var DropboxFileRecords = Backbone.Collection.extend({
  model: DropboxFileRecord,
  getForRender: function() {
    return this.map(function(record) {
      return record.getForRender();
    });
  }
});
