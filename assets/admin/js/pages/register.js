$().ready(function () {
  $('#signup').submit(function (event) {
    event.preventDefault();

    $.ajax({
      type: 'post',
      url: '/user',
      data: {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        confirmPassword: $('#confirmPassword').val()
      }
    }).done(function (data) {
      //alert('Zaregistrirovan! Vash id: ' + data.user.id);
      window.location = 'login.html'
    })
      .fail(function () {
        alert('Failed');
      });
  });
});
