var FileTypeView = Backbone.View.extend({
  render: function() {
    this.$el.empty();
    this.el.innerHTML = this.template({ file_types: this.fileTypeInfo });
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
        self.fileTypeInfo = _(self.data).map(function(fileTypeInfo) {
          return {type: fileTypeInfo[0],
                  size: filesize(fileTypeInfo[1]) }
        });
        callback();
      } else {
        //Need to deal with an error here.
      }
    }
    request.addEventListener('load', onRequestCallback);
    request.open('GET', '/app/by_mime_type');
    request.send();
  },
  className: 'file_type_view',
  template: HandlebarsTemplates.file_type_view
});
