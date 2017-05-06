$(document).ready(function () {

  getTotalNumberOfProducts();

});

function getTotalNumberOfProducts() {
  $.ajax({
    url: '/product',
    type: 'get'
  }).done(function (response) {
    $('#tovarSoni').text(response.length);
  }).fail(function (error) {
    console.log(error);
  });
}
