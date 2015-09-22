var TotalView = Backbone.View.extend({
  render: function() {
    this.$el.empty();
    this.el.innerHTML = this.template();
    return this;
  },
  initializeChart: function() {
    var ctx = this.el.querySelector("#total_chart").getContext('2d');
    var quotaInfo = this.model.getQuotaInformation();
    var data = [
    {
        value: quotaInfo.shared,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Shared Space Used"
    },
    {
        value: quotaInfo.normal,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Personal Space Used"
    },
    {
        value: quotaInfo.free,
        color:"#ccc",
        highlight: "#ccc",
        label: "Total Free Space"
    },];
    var myNewChart = new Chart(ctx).Pie(data, {
      tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= filesize(value) %>",
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><div class=\"legend_square\" style=\"background-color:<%=segments[i].fillColor%>\">&nbsp;</div><%if(segments[i].label){%><%=segments[i].label + ' - ' + filesize(segments[i].value) %><%}%></li><%}%></ul>"
    });
    this.el.querySelector('.legend').innerHTML = myNewChart.generateLegend();
  },
  afterDomAdd: function() {
    this.initializeChart();
  },
  className: 'total_view',
  template: HandlebarsTemplates.total_view
});
