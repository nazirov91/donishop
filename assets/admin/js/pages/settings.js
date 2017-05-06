function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

if(!getCookie('authorization')){
  window.location = 'login.html';
}

$(document).ready(function () {
  $.fn.editable.defaults.mode = 'popup'; // X-Editables mode popup || inline
  $.fn.editable.defaults.ajaxOptions = {type: "PUT"};
  $.fn.editable.defaults.send = 'always';

  populateCategories();
  populateBrands();

  addCategoriesToSelectOptions();

  initAddCategory();
  initAddBrand();


});

// -------------------- CATEGORY --------------------
function initAddCategory() {
  $('#addCategory').validate({
    rules: {
      kategoriya: {
        required: true
      }
    },
    messages: {
      kategoriya: {
        required: 'Bo\'sh qomasine'
      }
    },
    submitHandler: function () {

      if($('#mainCategory').val() == 0){
        $.ajax({
          type: 'post',
          url: '/categories',
          data: {
            name: $('#kategoriya').val()
          }
        }).done(function (response) {
          addSingleCategoryToSelectOption(response);
          populateCategories();
          $('#kategoriya').val('');
          swal({
            type: 'success',
            title: 'Yangi kategoriya!',
            text: 'Yangi kategoriya qo\'shildi: ' + response.name
          });
        }).fail(function (error) {
          console.log(error);
          swal({
            type: 'error',
            title: 'Nimadir nito ketti'
          });
        });
      } else {
        $.ajax({
          url: '/subcategories',
          type: 'post',
          data: {
            name: $('#kategoriya').val(),
            category: Number($('#mainCategory').val())
          }
        }).done(function (response) {
          populateCategories();
          $('#kategoriya').val('');
          swal({
            type: 'success',
            title: 'Yangi kategoriya!',
            text: 'Yangi kategoriya qo\'shildi: ' + response.name
          });
        }).fail(function (error) {
          console.log(error);
          swal({
            type: 'error',
            title: 'Nimadir nito ketti'
          });
        });
      }

    }
  });
}

function populateCategories() {
  $.ajax({
    url: '/categories',
    type: 'get'
  }).done(function (response) {
    var categories = [];

    $.each(response, function (i, category) {

      categories.push(
        '<!--Category-->'
        + '<li>'
        +   '<h3 class="category-header">'
        +     '<a href="javascript:;" class="xCat" id="cat' + category.id + '">'
        +       category.name
        +     '</a>'
        +     '<a href="javascript:;" class="pull-right deleteBtn">X</a>'
        +   '</h3>'
        +   '<ul class="list-unstyled subcategory">'
        +     getSubCategories(category)
        +   '</ul>'
        + '</li>'
        +'<!--End Category-->'
      );

    });

    function getSubCategories(category) {
      var subCategories = '';
      $.each(category.subCategories, function (i, sub) {
        subCategories +=
          '<li>'
        +   '<h5 class="subcategory-header">'
        +     '<a href="javascript:;" class="xSubcat" id="subcat' + sub.id + '" >'
        +       sub.name
        +     '</a>'
        +     '<a href="javascript:;" class="pull-right deleteBtn">X</a>'
        +   '</h5>'
        + '</li>';

      });
      return subCategories;
    }

    $('#listOfCategories')
      .empty()
      .append(categories.join(''))
      .on('click', 'a.deleteBtn', function () {
        // alert($(this).siblings().attr('id'));
        deleteCategory($(this).siblings().attr('id'));
      })
      .on('click', 'a.xCat', function () {
        $('#' + $(this).attr('id')).editable({
          url: '/categories/' + $(this).attr('id').split('cat').pop(),
          title: 'Nomini o\'zgartirish',
          placement: 'right',
          params: function (params) {
            params = {
              name: params.value
            };
            return params;
          },
          success: function (response, newValue) {
            alert(newValue);
          },
          error: function (response, newValue) {
            if(response.status === 500) {
              return 'Service unavailable. Please try later.';
            } else {
              return response.responseText;
            }
          }
        });
      }).on('click', 'a.xSubcat', function () {
      $('#' + $(this).attr('id')).editable({
        url: '/subcategories/' + $(this).attr('id').split('subcat').pop(),
        title: 'Nomini o\'zgartirish',
        placement: 'right',
        params: function (params) {
          params = {
            name: params.value
          };
          return params;
        },
        success: function (response, newValue) {
          alert(newValue);
        },
        error: function (response, newValue) {
          if(response.status === 500) {
            return 'Service unavailable. Please try later.';
          } else {
            return response.responseText;
          }
        }
      });
    });



  }).fail(function (error) {
    console.log(error);
  });
}

function deleteCategory(catToDelete) {
  swal({
    title: 'Kategoriyani o\'chirish!',
    text: 'Rostan o\'chirish kerakmi?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Ha, o\'chrilsin!',
    cancelButtonText: 'Yo\'q',
    closeOnConfirm: false
  }, function (isConfirm) {

    if(isConfirm){
      // $.ajax({
      //   url: '/categories/'
      // });
      if(catToDelete.indexOf('sub') > -1){ // if the deleting item is subcategory
        $.ajax({
          url: '/subcategories/' + Number(catToDelete.split('subcat').pop()),
          type: 'delete'
        }).done(function (response) {
          populateCategories();
          addCategoriesToSelectOptions();
          swal('O\'chirildi', response.name + ' bazadan o\'chirildi.', 'success');
        }).fail(function (error) {
          console.log(error);
          swal('O\'xshamadi', 'Kategoriya bazadan o\'chirilmadi.', 'error');
        });
      } else {
        $.ajax({
          url: '/categories/' + Number(catToDelete.split('cat').pop()),
          type: 'delete'
        }).done(function (response) {
          populateCategories();
          addCategoriesToSelectOptions();
          swal('O\'chirildi', response.name + ' bazadan o\'chirildi.', 'success');
        }).fail(function (error) {
          console.log(error);
          swal('O\'xshamadi', 'Kategoriya bazadan o\'chirilmadi.', 'error');
        });
      }
    }
  });
}

function addCategoriesToSelectOptions() {
  // Populate list of categories in the select options
  $.ajax({
    url: '/categories',
    type: 'get'
  }).done(function (response) {
    var categories = [];
    $.each(response, function (i, category) {
      categories.push(
        '<option value="' + category.id + '">' + category.name + '</option>'
      );
    });
    $('#mainCategory')
      .empty()
      .append('<option value="0">------Obshiy Kategoriya------</option>')
      .append(categories.join(''));

  }).fail(function (error) {
    console.log(error);
  });
}

function addSingleCategoryToSelectOption(category) {
  $('#mainCategory').append(
    '<option value="' + category.id + '">' + category.name + '</option>'
  )
}
// ======================== END CATEGORY ========================

// -------------------- BRAND --------------------
function initAddBrand() {
  $('#addBrand').validate({
    rules: {
      brend: {
        required: true
      }
    },
    messages: {
      brend: {
        required: 'Bo\'sh qomasine'
      }
    },
    submitHandler: function () {

      $.ajax({
        type: 'post',
        url: '/brands',
        data: {
          name: $('#brend').val()
        }
      }).done(function (response) {
        populateBrands();
        $('#brend').val('');
        swal({
          type: 'success',
          title: 'Yangi brend!',
          text: 'Yangi brend qo\'shildi: ' + response.name
        });
      }).fail(function (error) {
        console.log(error);
        swal({
          type: 'error',
          title: 'Nimadir nito ketti'
        });
      });
    }
  });
}

function populateBrands() {
  $.ajax({
    url: '/brands',
    type: 'get'
  }).done(function (response) {
    var brands = [];

    $.each(response, function (i, brand) {
      brands.push(
        '<!--Category-->'
        + '<li>'
        +   '<h3 class="category-header">'
        +     '<a href="javascript:;" class="xBrand" id="brand' + brand.id + '">'
        +       brand.name
        +     '</a>'
        +     '<a href="javascript:;" class="pull-right deleteBtn">X</a>'
        +   '</h3>'
        + '</li>'
        +'<!--End Category-->'
      );
    });


    $('#listOfBrands')
      .empty()
      .append(brands.join(''))
      .on('click', 'a.deleteBtn', function () {
        deleteBrand($(this).siblings().attr('id'));
      })
      .on('click', 'a.xBrand', function () {
        $('#' + $(this).attr('id')).editable({
          url: '/brands/' + $(this).attr('id').split('brand').pop(),
          title: 'Nomini o\'zgartirish',
          placement: 'right',
          params: function (params) {
            params = {
              name: params.value
            };
            return params;
          },
          success: function (response, newValue) {
            alert(newValue);
          },
          error: function (response, newValue) {
            if(response.status === 500) {
              return 'Service unavailable. Please try later.';
            } else {
              return response.responseText;
            }
          }
        });
      });



  }).fail(function (error) {
    console.log(error);
  });
}

function deleteBrand(brandToDelete) {
  swal({
    title: 'Brendni o\'chirish!',
    text: 'Rostan o\'chirish kerakmi?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Ha, o\'chrilsin!',
    cancelButtonText: 'Yo\'q',
    closeOnConfirm: false
  }, function (isConfirm) {

    if(isConfirm) {
      $.ajax({
        url: '/brands/' + Number(brandToDelete.split('brand').pop()),
        type: 'delete'
      }).done(function (response) {
        populateBrands();
        swal('O\'chirildi', response.name + ' bazadan o\'chirildi.', 'success');
      }).fail(function (error) {
        console.log(error);
        swal('O\'xshamadi', 'Brend bazadan o\'chirilmadi.', 'error');
      });
    }
  });
}


// ======================== END BRAND ========================
