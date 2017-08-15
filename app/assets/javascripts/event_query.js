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

  var attach = function(obj) {
    var attach_autocomplete_event = function() {
      mapping.add_autocomplete_listener(to_event_autocomplete, {
        marker_color: 'green',
        marker_name: 'home-start',
        delete_named: true
      });
      mapping.add_autocomplete_listener(to_home_autocomplete, {
        marker_color: 'blue',
        marker_name: 'home-end',
        delete_named: true
      });

      $('#address-to-event').focus(function() {
        $(this).select();
      })

      $('#address-to-home').focus(function() {
        $(this).select();
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
    
  }

  return {
    attach: attach
  }
}()