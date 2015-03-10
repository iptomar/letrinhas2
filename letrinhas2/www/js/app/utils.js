///Script para coisas utilitarios - neste caso para fazer o efeito de loding entr janelas/////
var utils = {
  loader: function(callback) {
    $('.loader').show('250', function() {
      setTimeout(function() {
        callback();
      }, 250);
    });
  },
};
