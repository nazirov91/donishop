
$(document).ready(function () {

  appendCategories();

  registerDropdownEvent();

  resetCategoryFilters();
});

function appendCategories() {
  $.ajax({
    url: '/categories',
    type: 'get'
  }).done(function (response) {

    appendIt();

    function getCategories() {
      var categories = [];

      $.each(response, function (i, category) {
        if(category.subCategories.length > 0){
          categories.push(
            '<li class="dropdown menu-item">'
            + '<a href="javascript:;" class="category_item" data-hover="dropdown" class="dropdown-toggle" data-toggle="dropdown">' + category.name + '</a>'
            + '<ul class="dropdown-menu mega-menu">'
            +   '<li class="yamm-content">'
            +     '<ul class="links list-unstyled">'
            +       getSubCategories(category)
            +     '</ul>'
            +   '</li>'
            + '</ul>'
            +'</li>'
          );
        } else {
          categories.push(
            '<li class="dropdown menu-item">'
            + '<a href="javascript:;" data-catId="'+ category.id +'" data-category="'+ category.name +'" class="filter">' + category.name + '</a>'
            +'</li>'
          );
        }
      });

      return categories.sort().join('');
    }

    function getSubCategories(Category) {
      var subcats = '<li><a href="javascript:;" data-catId="'+ Category.id +'" data-category="'+ Category.name +'" class="filter">- Все '+ Category.name +' -</a></li>';

      $.each(Category.subCategories, function (i, sub) {
        subcats += '<li><a href="javascript:;" data-catId="'+ sub.id +'" data-category="" class="filter">' + sub.name + '</a></li>';
      });
      return subcats;
    }

    function appendIt() {
      $('#categories')
        .empty()
        .append(getCategories())
        .on('click', 'a.filter', function (e) {
          e.preventDefault();

          deleteCookie('currentPage'); // Prevent pagination on category click

          if($(this).attr('data-category') === ''){ // If Subcategory
            setCookie('subCategoryFilter', $(this).attr('data-catId'), 0.001); // expires in 2.4 minutes
            deleteCookie('categoryFilter');

          } else { // If category
            setCookie('categoryFilter', $(this).attr('data-catId'), 0.001);
            deleteCookie('subCategoryFilter');
          }
          window.location = 'category.html';
        });
      registerDropdownEvent();
    }

  }).fail(function (error) {
    console.log(error);
  });
}

function registerDropdownEvent() {
  $('.dropdown')
    .off('show.bs.dropdown')
    .on('show.bs.dropdown');
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

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

function resetCategoryFilters(){
  $('#nav_products').click(function () {
    deleteCookie('categoryFilter');
    deleteCookie('subCategoryFilter');
  });
}



