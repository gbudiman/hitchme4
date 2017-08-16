var request = function() {
  var map = null;

  var attach = function(map_id) {
    var attach_map = function() {
      mapping.get_script().done(function() {
        map = mapping.attach(document.getElementById(map_id))
        cache.attach(map);
        mapping.attach_autocomplete(document.getElementById('address-pickup'));
        mapping.attach_autocomplete(document.getElementById('address-dropoff'));
      })
    }

    attach_map();
  }

  return {
    attach: attach
  }
}()