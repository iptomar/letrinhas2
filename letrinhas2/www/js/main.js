var app = {

  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onDeviceReady: function() {
    console.log("asda");

    app.receivedEvent('deviceready');
  },

  receivedEvent: function(id) {
    //navigator.splashscreen.hide();
  }
};
app.initialize();
