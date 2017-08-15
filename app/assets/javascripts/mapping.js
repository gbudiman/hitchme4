var mapping = function() {
  var map = null;
  var gmaps_script = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB0HMkhjSZwLxLMtOzokyyxQueN6G7fGK0&libraries=places';

  var add_autocomplete_listener = function(autocomplete_object, _opts) {
    var opts = _opts == undefined ? {} : _opts;
    var clear_all = opts.clear_all || false;
    var marker_name = opts.marker_name;
    var marker_color = opts.marker_color;
    var delete_named = opts.delete_named || false;

    return google.maps.event.addListener(autocomplete_object, 'place_changed', function() {
      var place = autocomplete_object.getPlace();
      var address = place.formatted_address;
      var coords = place.geometry.location;

      var marker = cache.address({
        address: address,
        coords: coords,
        clear_all: clear_all,
        marker_name: marker_name,
        marker_color: marker_color,
        delete_named: delete_named
      }).then(function(marker) {
        marker.setMap(map);
      })
    })
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

  return {
    add_autocomplete_listener: add_autocomplete_listener,
    attach: attach,
    attach_autocomplete: attach_autocomplete,
    clear_all_markers: clear_all_markers,
    get_script: get_script,
    remove_listener: remove_listener,
    get_coords: get_coords,
    set_bound: set_bound
  }
}()