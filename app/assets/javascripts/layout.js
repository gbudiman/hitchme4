var layout = function() {
  var get_workable_height = function() {
    return $(window).height() - $('nav').outerHeight();
  }

  var set_dashboard = function() {
    var _set_dashboard = function() {
      var height = get_workable_height();

      $('#dashboard-step-0').find('div.dashboard-vdiv').each(function() {
        $(this).css('height', (height / 3 - 8) + 'px');

        $(this).find('button')
          .css('width', '67%')
          .css('min-width', '256px')
          .css('height', (height / 6) + 'px')
          .css('margin-top', (height / 12) + 'px')
      })
    }
    $(window).resize(_set_dashboard);
    _set_dashboard();
  }

  return {
    set_dashboard: set_dashboard
  }
}()