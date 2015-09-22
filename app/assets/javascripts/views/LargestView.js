var LargestView = Backbone.View.extend({
  render: function() {
    this.$el.empty();
    this.el.innerHTML = this.template({ largest_files: this.fileRecords.getForRender() });
    return this
  },
  initializeTable: function() {
  },
  afterDomAdd: function() {
    this.initializeTable();
  },
  updateData: function(callback) {
    var request = new XMLHttpRequest();
    var self = this;
    var onRequestCallback = function() {
      if (request.status >= 200 && request.status < 400) {
        self.data = JSON.parse(this.responseText);
        self.fileRecords = new DropboxFileRecords(self.data);
        callback();
      } else {
        //Need to deal with an error here.
      }
    }
    request.addEventListener('load', onRequestCallback);
    request.open('GET', '/app/get_largest_files');
    request.send();
  },
  className: 'largest_view',
  template: HandlebarsTemplates.largest_view
});
