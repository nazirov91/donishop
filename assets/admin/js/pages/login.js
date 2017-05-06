$().ready(function () {
  $('#login').submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: 'post',
      url: '/admin',
      data: {
        email: $('#email_login').val(),
        password: $('#password_login').val()
      }
    }).done(function (data) {
      //alert('Avtorizovan! ' + data.user.id + ': email: ' + data.user.email);
      setCookie('authorization', 'Bearer ' + data.token, 1);

      function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
      window.location = 'index.html'
    }).fail(function (error) {
      alert('Failed ' + error);
    });
  });
});
