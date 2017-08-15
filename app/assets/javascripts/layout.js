var layout = function() {
  var get_workable_height = function() {
    return $(window).height() - $('nav').outerHeight();
  }

  var set_dashboard_event = function() {
    var _set_dashboard_event = function() {
      var height = get_workable_height();

      $('#dashboard-event-manager').find('div.dashboard-vdiv').each(function() {
        $(this).css('height', (height / 2) + 'px')
      })
    }

    $(window).resize(_set_dashboard_event);
    _set_dashboard_event();
  }

  var set_dashboard_offer = function() {
    var _set_dashboard_offer = function() {
      var height = get_workable_height();

      $('#dashboard-offer-manager').find('div.dashboard-vdiv').each(function() {
        $(this).css('height', (height / 2) + 'px')
      })
    }

    $(window).resize(_set_dashboard_offer);
    _set_dashboard_offer();
  }

  var set_dashboard_zero = function() {
    var _set_dashboard_zero = function() {
      var height = get_workable_height();

      $('#dashboard-step-0').find('div.dashboard-vdiv').each(function() {
        $(this).css('height', (height / 3) + 'px');

        $(this).find('button')
          .css('width', '67%')
          .css('min-width', '256px')
          .css('height', (height / 6) + 'px')
          .css('margin-top', (height / 12) + 'px')
      })
    }
    $(window).resize(_set_dashboard_zero);
    _set_dashboard();
  }

  return {
    set_dashboard_zero: set_dashboard_zero,
    set_dashboard_event: set_dashboard_event,
    set_dashboard_offer: set_dashboard_offer
  }
}()