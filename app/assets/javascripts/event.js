var event = function() {
  var date_id_counter = 0;
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
              +   '<input type="text" class="form-control" placeholder="Then add some date..." />'
              +   '<span class="input-group-addon">'
              +     '<span class="glyphicon glyphicon-calendar" />'
              +   '</span>'
              + '</div>';

        $('#event-date-holder').append(t);

        var npicker = $('#datetimepicker-' + date_id_counter++);
        npicker.datetimepicker();
        npicker.find('input').val(prefilled_date);
        npicker.find('.glyphicon-remove').on('click', function() {
          $(this).parent().parent().remove();
        })
      })

      $('#add-event-date').trigger('click');
    }

    var attach_add_event_button = function() {
      $('#expand-add-event').on('click', function() {
        swith_to_add_event(true);
      })
    }

    var attach_cancel_button = function() {
      $('#add-event-cancel').on('click', function() {
        swith_to_add_event(false);
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
    attach_save_button();
    init_interface();
    fetch_remote();
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
    

    body.empty();

    if (res == null) {
      body.append('<li class="list-group-item">No data found</li>');
    } else {
      var t = '';
      $.each(res, function(i, d) {
        t += '<li class="list-group-item">'
          +    '<b>' + d.name + '</b>'
          +    '<a class="pull-right" href="#" data-delete-id=' + d.id + '>Delete</a>'
          +    '<br />'
          +    d.address
          +    '<br />'
          +    moment(d.time_start).format('llll')
          +  '</li>'
      })
      body.append(t);
      attach_delete_buttons();
    }
  }

  return {
    attach: attach
  }
}()