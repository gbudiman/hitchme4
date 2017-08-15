var mapping = function() {
  var map = null;
  var gmaps_script = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB0HMkhjSZwLxLMtOzokyyxQueN6G7fGK0&libraries=places';

  var stringify_coords = function(position) {
    return '[' + position.lat() + ', ' + position.lng() + ']';
  }

  var add_autocomplete_listener = function(autocomplete_object, _opts) {
    var opts = _opts == undefined ? {} : _opts;
    var clear_all = opts.clear_all || false;
    var marker_name = opts.marker_name;
    var marker_color = opts.marker_color;
    var delete_named = opts.delete_named || false;
    var focus_one = opts.focus_one || false;
    var func = opts.func;

    var _exec = function(address) {
      var marker = cache.address({
        address: address,
        //coords: coords,
        clear_all: clear_all,
        marker_name: marker_name,
        marker_color: marker_color,
        delete_named: delete_named
      }).then(function(marker) {
        marker.setMap(map);

        if (focus_one) {
          set_bound([marker]);
        }
        if (func != undefined) func();
      })
    }

    if (opts.jq_object != undefined) {
      // TODO: THIS IS A HACK!!!
      // Google's place_changed event does not fire when user
      // input previously searched address
      opts.jq_object.on('change', function() {
        setTimeout(function() {
          var val = opts.jq_object.val().trim();
          _exec(val);
        }, 50)
      })
    }    
  }

  var attach = function(obj) {
    map = new google.maps.Map(obj, {
      center: {lat: 34.0522, lng: -118.2437},
      zoom: 11
    })
    return map;
  }

  var attach_autocomplete = function(obj) {
    return new google.maps.places.Autocomplete(obj);
  }

  var get_coords = function(obj) {
    return new google.maps.LatLng(obj.lat(), obj.lng());
  }

  var clear_all_markers = function(obj) {
    $.each(cache.get_all_markers(), function(i, m) {
      m.setMap(null);
    })
  }

  var compute_route = function(start, end, waypoints) {
    return new Promise(function(resolve, reject) {
      var dir_serv = new google.maps.DirectionsService;

      dir_serv.route({
        origin: start,
        destination: end,
        optimizeWaypoints: true,
        travelMode: 'DRIVING',
        avoidTolls: true
      }, function(response, status) {
        if (status == 'OK') {
          resolve(response);
        }
      })
    })
  }

  var draw_route = function(h) {
    cache.route(h).then(function(res) {
      res.setMap(map);
    })
  }

  var force_fill_autocomplete = function(h) {
    return new Promise(function(resolve, reject) {
      var marker = cache.address({
        address: h.address,
        clear_all: false,
        marker_name: h.marker_name,
        marker_color: h.marker_color,
        delete_named: true
      }).then(function(marker) {
        marker.setMap(map);
        resolve(true); 
      })
    })

  }

  var get_script = function() {
    return $.getScript(gmaps_script);
  }

  var remove_listener = function(obj) {
    google.maps.event.removeListener(obj);
  }

  var set_bound = function(markers) {
    var bounds = new google.maps.LatLngBounds();
    $.each(markers, function(i, m) {
      bounds.extend(m.position);
    })

    map.fitBounds(bounds);
    map.setOptions({ zoom: 11 });
  }

  var set_cached_bounds = function(marker_names) {
    var bounds = new google.maps.LatLngBounds();
    $.each(marker_names, function(i, name) {
      var marker = cache.get_marker_by_name(name);
      bounds.extend(marker.position);
    })

    map.fitBounds(bounds);
  }

  return {
    add_autocomplete_listener: add_autocomplete_listener,
    attach: attach,
    attach_autocomplete: attach_autocomplete,
    clear_all_markers: clear_all_markers,
    compute_route: compute_route,
    draw_route: draw_route,
    force_fill_autocomplete: force_fill_autocomplete,
    get_script: get_script,
    remove_listener: remove_listener,
    get_coords: get_coords,
    set_bound: set_bound,
    set_cached_bounds: set_cached_bounds
  }
}()