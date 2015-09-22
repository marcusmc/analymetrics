var AppView = Backbone.View.extend({
  render: function() {
    this.el.innerHTML = this.template();
    this.initializeStage();
    return this;
  },
  events: {
    "click .navigation_options li": "navigate"
  },
  template: HandlebarsTemplates.app_view,
  initializeStage: function() {
    this.stage = this.el.querySelector('.stage');
  },
  navigate: function(e) {
    var target = e.target;
    var view = target.getAttribute('data-view');
    this['initialize' + view]();
    this.$(".navigation_options li").removeClass('selected');
    $(target).addClass('selected');
  },
  initializeTotalView: function() {
    if (this.totalView) {
      this.setView(this.totalView);
      //this.totalView.updateData(function() {
        //this.totalView.render();
      //}.bind(this));
    } else {
      this.totalView = new TotalView({ model: AnaMetrics.user });
      this.setView(this.totalView);
      //this.totalView.updateData(function() {
        //this.setView(this.totalView);
      //}.bind(this));
    }
  },
  initializeLargestView: function() {
    if (this.largestView) {
      this.setView(this.largestView);
      this.largestView.updateData(function() {
        this.largestView.render();
      }.bind(this));
    } else {
      this.largestView = new LargestView();
      this.largestView.updateData(function() {
        this.setView(this.largestView);
      }.bind(this));
    }
  },
  initializeFileTypeView: function() {
    if (this.fileTypeView) {
      this.setView(this.fileTypeView);
      this.fileTypeView.updateData(function() {
        this.fileTypeView.render();
      }.bind(this));
    } else {
      this.fileTypeView = new FileTypeView();
      this.fileTypeView.updateData(function() {
        this.setView(this.fileTypeView);
      }.bind(this));
    }
  },
  setView: function(view) {
    if (!this.currentView) this.stage.innerHTML = '';
    if (this.currentView) this.stage.removeChild(this.currentView.el);
    this.stage.appendChild(view.render().el);
    this.currentView = view;
    if (this.currentView && this.currentView.afterDomAdd) this.currentView.afterDomAdd();
  },
});
