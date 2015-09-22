var User = Backbone.Model.extend({
  getQuotaInformation: function() {
    var quotaInfo = this.get('quota_info');
    var shared = quotaInfo.shared || 0;
    quotaInfo.free = quotaInfo.quota - (quotaInfo.normal + shared);
    return quotaInfo;
  }
});
