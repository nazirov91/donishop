$(document).ready(function () {

  appendProducts();
});

function appendProducts(){
  $.ajax({
    url: '/product',
    type: 'get'
  }).done(function (response) {
    var products = [];

    $.each(response, function (i, product) {
      products.push(
        '<tr id="' + product.id + '">'
        + '<td>'
        +   product.header
        + '</td>'
        + '<td>'
        +   product.model
        + '</td>'
        + '<td>'
        +   product.discountPrice
        + '</td>'
        + '<td>'
        +   product.createdAt.substring(0, product.createdAt.indexOf('T'))
        + '</td>'
        + '<td>'
        +   inStock(product)
        + '</td>'
        + '<td class="text-right">'
        +   '<div class="btn-group">'
        +     '<a class="btn-white btn btn-xs editBtn" data-id="' + product.id + '">O\'zgartirish</a>'
        +     '<a class="btn-white btn btn-xs deleteBtn" data-id="' + product.id + '">O\'chirish</a>'
        +   '</div>'
        + '</td>' +
        '</tr>'

      );
    });

    $('#productList')
      .empty()
      .append(products.join(''))
      .on('click', 'a.editBtn', function (e) {

        setCookie('editProd', $(this).attr('data-id'), 0.01);
        window.location = 'edit_product.html';
        e.preventDefault();
      })
      .on('click', 'a.deleteBtn', function (e) {
        var productID = $(this).attr('data-id');

        swal({
          title: 'Tovarni o\'chirish!',
          text: 'Rostan o\'chirish kerakmi?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Ha, o\'chrilsin!',
          cancelButtonText: 'Yo\'q',
          closeOnConfirm: true
        }, function (isConfirm) {
          if(isConfirm){

            $.ajax({
              url: '/product/' + productID,
              type: 'delete'
            }).done(function (product) {
              toastr.success(product.header + ' bazadan o\'chirilidi.');
              $('#' + product.id).remove();
            }).fail(function (error) {
              console.log(error);
            });
          }
        });

        e.preventDefault();
      });

    function inStock(prod) {
      if(prod.inStock){
        return '<span class="label label-primary">Bor</span>'
      } else {
        return '<span class="label label-warning">Yo\'q</span>'
      }
    }
  }).fail(function (error) {
    console.log(error);
  });
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
