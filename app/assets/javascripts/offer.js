var offer = function() {
  var map = null;
  var to_event_autocomplete = null;
  var to_home_autocomplete = null;
  var time_to_home_changed = false;
  var selected_event = {
    id: null,
    address: null,
    time_start: null
  }

  var draw_route = function() {
    if ($('#address-to-event').val().trim().length > 0) {
      mapping.draw_route({
        origin: 'home-start', 
        destination: 'event', 
        intermediates: [], 
        name: 'home-to-event',
        delete_named: true,
        color: 'green'
      });
    } else {
      mapping.delete_route('home-to-event')
    }
    
    if ($('#address-to-home').val().trim().length > 0) {
      mapping.draw_route({
        origin: 'event', 
        destination: 'home-end', 
        intermediates: [], 
        name: 'event-to-home',
        delete_named: true,
        color: 'blue'
      });
    } else {
      mapping.delete_route('event-to-home');
    }
    
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


  var attach = function(map_id) {
    var attach_autocomplete_event = function() {
      mapping.add_autocomplete_listener(to_event_autocomplete, {
        marker_color: 'green',
        marker_name: 'home-start',
        delete_named: true,
        jq_object: $('#address-to-event'),
        func: function() {
          var copy_val = $('#address-to-event').val().trim();

          redraw_pins().then(function() {
            draw_route()
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
            draw_route()
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

    var attach_map = function() {
      mapping.get_script().done(function() {
        map = mapping.attach(document.getElementById(map_id))
        cache.attach(map);
        mapping.attach_autocomplete(document.getElementById('address-to-event'))
        mapping.attach_autocomplete(document.getElementById('address-to-home'))
        attach_autocomplete_event();
      })
    }

    var attach_save_button = function() {
      $('#save-trip').on('click', function() {
        $.ajax({
          url: '/offers/post',
          method: 'POST',
          data: get_data()
        }).done(function(res) {
          if (res.success) {
            fetch_trip_info();
          }
        })
      })

      $('#cancel-edit').on('click', function() {
        fetch_trip_info();
      })
    }

    attach_map();
    attach_dates();
    attach_save_button();
  }

  var fetch_trip_info = function() {
    var render_existing_offer = function(res) {
      var activate_edit = function() {
        $('a[data-context]').off('click').on('click', function(e) {
          var context = $(this).attr('data-context');
          
          $('#' + context + '-editor').show();
          $('#' + context + '-current').hide();

          $('#editor-interface').show();
          e.preventDefault();
        })
      }

      var activate_delete = function() {
        $('a[data-delete-id]').off('click').on('click', function(e) {
          var id = $(this).attr('data-delete-id');

          $.ajax({
            url: '/offers/delete',
            method: 'POST',
            data: {
              id: id
            }
          }).done(function(res) {
            if (res.success) {
              fetch_trip_info();
            }
          })
          e.preventDefault();
        })
      }

      var activate_schedule = function() {
        $('a[data-schedule-context]').off('click').on('click', function(e) {
          var context = $(this).attr('data-schedule-context');

          $('#' + context + '-editor').show();
          $('#editor-interface').show();
          $(this).parent().hide();

          if (context == 'to-home') {
            if ($('#address-to-event').val().trim().length > 0) {
              $('#address-to-home')
                .val($('#address-to-event').val().trim())
                .trigger('change');

            }
          }
          e.preventDefault();
        })
      }


      var dict = {
        to_home: { key: 'to-home', text: 'Trip Back Home' },
        to_event: { key: 'to-event', text: 'Trip To Event' }
      }

      $('#offer-details').show();

      $('#to-event-editor').hide();
      $('#to-event-none').show();
      $('#to-event-current').hide();
      $('#address-to-event').val('');

      $('#to-home-editor').hide();
      $('#to-home-none').show();
      $('#to-home-current').hide();
      $('#address-to-home').val('');

      $('#editor-interface').hide();

      $.each(res, function(_key, d) {
        var key = dict[_key].key

        $('#' + key + '-editor').hide();
        $('#' + key + '-none').hide();
        $('#' + key + '-current').show();

        var container = $('#' + key + '-current');
        container.empty();

        var t = dict[_key].text
              + ' (' + d.space_passenger + ' passengers slot)'
              + '<a href="#" class="pull-right" data-context="' + key + '">Edit</a>'
              + '<br />'
              + d.address
              + '<br />'
              + moment(d.time_start).format('llll')

        var prefill = moment(d.time_start).format('YYYY-MM-DD HH:mm');
        $('#address-' + key).val(d.address);
        $('#time-' + key).data('DateTimePicker').date(new Date(prefill));
        $('#passenger-space-' + key).val(d.space_passenger);
        $('#delete-trip-' + key)
          .attr('data-delete-id', d.id)
          .attr('style', '')
        container.append(t);
      })

      redraw_pins().then(draw_route);
      activate_edit();
      activate_delete();
      activate_schedule();
    }

    $.ajax({
      url: '/offers/current',
      method: 'GET',
      data: {
        event_id: selected_event.id
      }
    }).done(function(res) {
      render_existing_offer(res);
    })
  }

  var get_data = function() {
    return {
      event_id: selected_event.id,
      to_event_address: $('#address-to-event').val().trim(),
      to_event_time: moment($('#time-to-event').val()).unix(),
      to_home_address: $('#address-to-home').val().trim(),
      to_home_time: moment($('#time-to-home').val()).unix(),
      to_event_passenger_space: $('#passenger-space-to-event').val(),
      to_home_passenger_space: $('#passenger-space-to-home').val()
    }
  }

  var set_event_on_map = function() {
    cache.address({
      address: selected_event.address,
      marker_name: 'event',
      clear_all: true
    }).then(function(marker) {
      marker.setMap(map);
    })
  }

  var set_selected_event = function(h) {
    selected_event = h;

    $('#event-address').text(selected_event.address);
    $('#event-start-time').text(selected_event.time_start);

  }

  return {
    attach: attach,
    fetch_trip_info: fetch_trip_info,
    get_selected_event: function() { return selected_event; },
    set_selected_event: set_selected_event,
    set_event_on_map: set_event_on_map
  }
}()