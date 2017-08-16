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

  var attach = function(obj, map_id) {
    var attach_event_query = function() {
      var helper = offer || request;

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
                date_start: moment(r.time_start).format('l'),
                id: r.id
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
        helper.set_selected_event({
          id: s.id,
          address: s.address,
          time_start: s.time_start
        });

        helper.set_event_on_map();
        helper.fetch_trip_info();       
      })
    }

    attach_event_query();
  }

  return {
    attach: attach
  } 
}()