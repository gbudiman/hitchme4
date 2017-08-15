var event = function() {
  var date_id_counter = 0;
  var address_autocomplete = null;
  var editable_autocomplete = null;
  var map = null;

  var attach = function() {
    var attach_add_date_button = function() {
      var prefilled_date = null;
      
      $('#add-event-date').on('click', function() {
        var prev_occurrence = $('#datetimepicker-' + (date_id_counter - 1));
      
        if (prev_occurrence.length > 0) {
          prefilled_date = prev_occurrence.find('input').val();
        }

        var t = '<div class="input-group date" id="datetimepicker-' + date_id_counter + '">'
              +   '<span class="input-group-addon">'
              +     '<span class="glyphicon glyphicon-remove clickable" />'
              +   '</span>'
              +   '<input type="text" class="form-control" '
              +     'id="datetimepicker-field-' + date_id_counter + '" '
              +     'placeholder="Then add some date..." />'
              + '</div>';

        $('#event-date-holder').append(t);

        var ngroup = $('#datetimepicker-' + date_id_counter);
        var npicker = $('#datetimepicker-field-' + date_id_counter);
        npicker.datetimepicker();
        ngroup.find('input').val(prefilled_date);
        ngroup.find('.glyphicon-remove').on('click', function() {
          $(this).parent().parent().remove();
        })

        date_id_counter++;
      })

      $('#add-event-date').trigger('click');
    }

    var attach_add_event_button = function() {
      $('#expand-add-event').on('click', function() {
        swith_to_add_event(true);
      })
    }

    var attach_autocomplete_event = function() {
      mapping.add_autocomplete_listener(address_autocomplete, { clear_all: true});

      $('#event-address').focus(function() {
        $(this).select();
      })
    }

    var attach_cancel_button = function() {
      $('#add-event-cancel').on('click', function() {
        swith_to_add_event(false);
        mapping.clear_all_markers();
      })
    }

    var attach_map = function() {
      //$.getScript(gmaps_script).done(function() {
      mapping.get_script().done(function() {
        map = mapping.attach(document.getElementById('db-event-map'))
        cache.attach(map);
        address_autocomplete = mapping.attach_autocomplete(document.getElementById('event-address'))
        attach_autocomplete_event();
      })
    }

    var attach_save_button = function() {
      $('#add-event-save').on('click', function() {
        post_remote();
      })
    }

    var init_interface = function() {
      $('#add-event-interface').hide();
    }

    attach_add_event_button();
    attach_add_date_button();
    attach_cancel_button();
    attach_map();
    attach_save_button();
    init_interface();
    fetch_remote();
  }

  var clear_fields = function() {
    $('#event-name').val('');
    $('#event-address').val('');
  }

  var fetch_remote = function() {
    $.ajax({
      url: '/events/fetch'
    }).done(function(res) {
      update_event_list(res);
    })
  }

  var post_remote = function() {
    var get_data = function() {
      var get_dates = function() {
        var dates = [];

        $('#event-date-holder').find('input').each(function() {
          dates.push(moment($(this).val().trim()).unix());
        })

        return dates;
      }

      return {
        name: $('#event-name').val().trim(),
        address: $('#event-address').val().trim(),
        dates: get_dates()
      }
    }

    $.ajax({
      url: '/events/post',
      data: get_data(),
      method: 'POST'
    }).done(function(res) {
      if (res.success) {
        $('#event-date-holder').empty();
        $('#add-event-date').trigger('click');
        swith_to_add_event(false);
        fetch_remote();
        clear_fields();
      }
    })
  }

  var swith_to_add_event = function(val) {
    if (val) {
      $('#add-event-interface').show();
      $('#expand-add-event').hide();
    } else {
      $('#add-event-interface').hide();
      $('#expand-add-event').show();
    }
  }

  var update_event_list = function(res) {
    var body = $('#db-event-list-body');
    var attach_delete_buttons = function() {
      body.find('a[data-delete-id]').on('click', function(evt) {
        var $this = $(this);
        var id = $this.attr('data-delete-id');

        $.ajax({
          url: '/events/delete',
          method: 'POST',
          data: { id: id }
        }).done(function(res) {
          if (res.success) {
            $this.parent().remove();
          }
        })
        evt.preventDefault();
      })
    }

    var attach_edit_interface = function(id) {
      var make_editable_template = function(obj, name, type) {
        return obj.editable({
          type: type,
          pk: obj.attr('data-id'),
          url: '/events/edit',
          mode: 'inline',
          name: name,
          onblur: 'ignore',
          validate: function(value) {
            if (value.trim() == '') {
              return 'Please do not leave me empty :(';
            }
          }
        })
      }

      var make_editable_datetime = function(obj) {
        var field = '<div class="input-group date">'
                  +   '<span class="input-group-addon">'
                  +     '<span class="glyphicon glyphicon-remove" id="editable-time-remove" />'
                  +   '</span>'
                  +   '<span class="input-group-addon">'
                  +     '<span>New Date</span>'
                  +   '</span>'
                  +   '<input type="text" class="form-control" id="editable-datetimepicker" />'
                  +   '<span class="input-group-addon">'
                  +     '<span class="glyphicon glyphicon-ok" id="editable-time-save" />'
                  +   '</span>'
                  + '</div>'
        $('#editable-datetimepicker').parent().remove();
        obj.after(field);
        var existing_date = moment(obj.text()).format('YYYY-MM-DD HH:mm');
        $('#editable-datetimepicker').datetimepicker();
        $('#editable-datetimepicker').data('DateTimePicker').date(new Date(existing_date));
          

        $('#editable-time-remove').on('click', function() {
          $('#editable-datetimepicker').parent().remove();
        })
        $('#editable-time-save').on('click', function() {
          $.ajax({
            url: '/events/edit',
            method: 'POST',
            data: {
              pk: obj.attr('data-id'),
              value: moment($('#editable-datetimepicker').val()).unix(),
              name: 'time_start'
            }
          }).done(function(res) {
            if (res.success) {
              obj.text(moment($('#editable-datetimepicker').val()).format('llll'));
              $('#editable-datetimepicker').parent().remove();
            }
          })
        })
      }

      body.find('span.list-event-name').each(function() {
        make_editable_template($(this), 'name', 'text')
      })

      body.find('span.list-event-address').each(function() {
        var tpl = make_editable_template($(this), 'address', 'text');
        var listener = null;

        tpl.on('shown', function(e, editable) {
          var input = editable.input['$input'][0];
          
          editable_autocomplete = mapping.attach_autocomplete(input);
          listener = mapping.add_autocomplete_listener(editable_autocomplete);
        }).on('save', function(e, params) {
          mapping.remove_listener(listener);
        })
      })

      body.find('span.list-event-start-date-editable').each(function() {
        //make_editable_template($(this), 'time-start', 'date')
        $(this).on('click', function() {
          make_editable_datetime($(this)) 
        });
      })
    }
    

    body.empty();

    if (res == null) {
      body.append('<li class="list-group-item">No data found</li>');
    } else {
      var t = '';
      $.each(res, function(i, d) {
        t += '<li class="list-group-item">'
          +    '<span class="list-event-name" data-id=' + d.id + '>' + d.name + '</span>'
          +    '<span class="pull-right">'
          +      '<a href="#" data-delete-id=' + d.id + '>Delete</a>'
          +    '</span>'
          +    '<br />'
          +    '<span class="list-event-address" data-id=' + d.id + '>' + d.address + '</span>'
          +    '<br />'
          +    '<span class="list-event-start-date-editable" data-id=' + d.id + '>'
          +      moment(d.time_start).format('llll')
          +    '</span>'
          +  '</li>'
      })
      body.append(t);
      attach_delete_buttons();
      attach_edit_interface();
    }
  }

  return {
    attach: attach
  }
}()