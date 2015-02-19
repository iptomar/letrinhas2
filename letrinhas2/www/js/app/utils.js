var utils = {

  loader: function(callback) {
    $('.loader').show('250', function() {
      setTimeout(function() {
        callback();
      }, 250);
    });
  },

};