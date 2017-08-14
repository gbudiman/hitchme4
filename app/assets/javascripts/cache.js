var cache = function() {
  var addresses = {};
  var markers = {};
  var routes = {};
  var map = null;

  var attach = function(_map) {
    map = _map;
  }

  var address = function(h) {
    var addr = h.address;
    var coords = h.coords;
    var clear_all = h.clear_all || false;
    var set_bound = h.set_bound || true;

    if (clear_all) clear_all_markers();

    if (addresses[addr] == undefined) {
      // Address not found in cache  
      if (coords != undefined) {
        // Coords is supplied so use it
        addresses[address] = mapping.get_coords(coords);
      } else {
        // Need to invoke geolocation
      }
    } 

    markers[address] = new google.maps.Marker({
      position: addresses[address]
    })

    if (set_bound) mapping.set_bound(get_all_markers());

    return markers[address];
  }

  var route = function(a, b) {

  }

  var clear_all_markers = function() {
    $.each(get_all_markers(), function(i, m) {
      m.setMap(null);
    })
  }

  var get_all_markers = function() {
    return Object.values(markers);
  }

  var dump = function() {
    console.log(addresses);
    console.log(markers);
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