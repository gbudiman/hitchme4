var cache = function() {
  var addresses = {};
  var markers = {};
  var routes = {};
  var map = null;
  var marker_names = {};

  var attach = function(_map) {
    map = _map;
  }

  var address = function(h) {
    var addr = h.address;
    var coords = h.coords;
    var clear_all = h.clear_all || false;
    var set_bound = h.set_bound || true;
    var marker_name = h.marker_name;
    var marker_color = h.marker_color;
    var delete_named = h.delete_named;

    var _do_rest = function() {
      return new Promise(function(resolve, reject) {
        if (set_bound) mapping.set_bound(get_all_markers());
        if (marker_name != undefined) {
          marker_names[marker_name] = markers[addr];
        }

        set_marker_color(markers[addr], marker_color);
        resolve(markers[addr]);
      })
      
    }

    if (clear_all) clear_all_markers();

    if (delete_named) {
      if (marker_name == undefined) {
        throw('cache::address() is supplied with delete_named option, but marker_name is not given')
      }

      clear_marker(marker_name);
    }

    return new Promise(function(resolve, reject) {
      if (addresses[addr] == undefined) {
        // Address not found in cache  
        if (coords != undefined) {
          // Coords is supplied so use it
          addresses[addr] = mapping.get_coords(coords);
          markers[addr] = new google.maps.Marker({
            position: addresses[addr]
          })
          resolve(_do_rest());
        } else {
          // Need to invoke geolocation
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({
            address: addr
          }, function(results, status) {
            if (status == 'OK') {
              addresses[addr] = results[0].geometry.location;
              markers[addr] = new google.maps.Marker({
                position: results[0].geometry.location
              })



              resolve(_do_rest());
            }
          }) 
        }
      } 
    })
    
  }

  var route = function(a, b) {

  }

  var clear_marker = function(x) {
    if (marker_names[x] != undefined) {
      marker_names[x].setMap(null);
    }
  }

  var clear_all_markers = function() {
    $.each(get_all_markers(), function(i, m) {
      m.setMap(null);
    })
  }

  var get_all_markers = function() {
    return Object.values(markers);
  }

  var set_marker_color = function(obj, color) {
    if (color == undefined) return;
    obj.setIcon('http://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png')
  }

  var dump = function() {
    console.log(addresses);
    console.log(markers);
    console.log(marker_names);
  }

  return {
    attach: attach,
    address: address,
    route: route,
    clear_all_markers: clear_all_markers,
    get_all_markers: get_all_markers,
    dump: dump
  }
}()