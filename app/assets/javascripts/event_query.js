var event_query = function() {
  var map = null;
  var events = null;
  var hb_template = '<div class="col-xs-12">'
                  +   '<span class="list-event-name">{{name}}</span>'
                  +   '<br />'
                  +   '<span class="list-event-address">{{address}}</span>'
                  +   '<br />'
                  +   '<span class="list-event-start-date">{{time_start}}</span>'
                  + '</div>';

  var to_event_autocomplete = null;
  var to_home_autocomplete = null;
  var time_to_home_changed = false;

  var attach = function(obj) {
    var attach_autocomplete_event = function() {
      var post_func = function() {
        mapping.draw_route({
          origin: 'home-start', 
          destination: 'event', 
          intermediates: [], 
          name: 'home-to-event',
          delete_named: true,
          color: 'green'
        });
        mapping.draw_route({
          origin: 'event', 
          destination: 'home-end', 
          intermediates: [], 
          name: 'event-to-home',
          delete_named: true,
          color: 'blue'
        });
      }

      var redraw_pins = function() {
        return new Promise(function(resolve, reject) {
          mapping.force_fill_autocomplete({
            address: $('#address-to-event').val(),
            marker_name: 'home-start',
            marker_color: 'green',
            delete_named: true
          }).then(function() {
            mapping.force_fill_autocomplete({
              address: $('#address-to-home').val(),
              marker_name: 'home-end',
              marker_color: 'blue',
              delete_named: true
            }).then(function() {
              // TODO: ANOTHER HACK!!!
              // Bounds seem to require callback
              setTimeout(function() {
                mapping.set_cached_bounds(['home-start', 'event', 'home-end']);
              }, 100);
              
              resolve(true);
            })
          })
        })
        
      }

      mapping.add_autocomplete_listener(to_event_autocomplete, {
        marker_color: 'green',
        marker_name: 'home-start',
        delete_named: true,
        jq_object: $('#address-to-event'),
        func: function() {
          var copy_val = $('#address-to-event').val().trim();

          if ($('#address-to-home').val().trim().length == 0) {
            $('#address-to-home').val(copy_val);
          }

          redraw_pins().then(function() {
            post_func();
          })
        }
      });

      mapping.add_autocomplete_listener(to_home_autocomplete, {
        marker_color: 'blue',
        marker_name: 'home-end',
        delete_named: true,
        jq_object: $('#address-to-home'),
        func: function() {
          redraw_pins().then(function() {
            post_func();
          })
        }
      });

      $('#address-to-event').focus(function() {
        $(this).select();
      })

      $('#address-to-home').focus(function() {
        $(this).select();
      })
    }

    var attach_dates = function() {
      $('#time-to-event').datetimepicker();
      $('#time-to-home').datetimepicker();

      $('#time-to-event').on('dp.change', function() {
        if (!time_to_home_changed) {
          $('#time-to-home').val($('#time-to-event').val());
        }
      })

      $('#time-to-home').on('dp.change', function() {
        time_to_home_changed = true;
      })
    }

    var attach_event_query = function() {
      events = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          url: '/events/search/%QUERY',
          wildcard: '%QUERY',
          transform: function(res) {
            return $.map(res, function(r) {
              return {
                name: r.name,
                address: r.address,
                time_start: moment(r.time_start).format('llll'),
                date_start: moment(r.time_start).format('l')
              }
            })
          }
        },
      })

      obj.typeahead({
        hint: true,
        highlight: true,
        minLength: 2
      }, {
        source: events,
        templates: {
          empty: '<div class="col-xs-12">Nothing found :(</div>',
          suggestion: Handlebars.compile(hb_template)
        },
        displayKey: 'name'
      }).on('typeahead:select', function(e, s) {
        $('#event-address').text(s.address);
        $('#event-start-time').text(s.time_start);
        $('#offer-details').show();

        cache.address({
          address: s.address,
          marker_name: 'event',
          clear_all: true,
        }).then(function(marker) {
          marker.setMap(map);
        });

       
      })
    }

    var attach_map = function() {
      mapping.get_script().done(function() {
        map = mapping.attach(document.getElementById('db-offer-map'))
        cache.attach(map);
        to_event_autocomplete = mapping.attach_autocomplete(document.getElementById('address-to-event'))
        to_home_autocomplete = mapping.attach_autocomplete(document.getElementById('address-to-home'))
        attach_autocomplete_event();
      })
    }

    attach_map();
    attach_event_query();
    attach_dates();
  }

  return {
    attach: attach
  }
}()