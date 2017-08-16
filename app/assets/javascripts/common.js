var common = function() {
  var attach_map = function(map_id) {
    return new Promise(function(resolve, reject) {
      var map = null;

      mapping.get_script().done(function() {
        map = mapping.attach(document.getElementById(map_id))
        
      })
    })
    
  }
  return {
    attach_map: attach_map
  }
}()