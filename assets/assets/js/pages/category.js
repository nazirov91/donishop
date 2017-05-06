$(document).ready(function () {

  $.ajax({
    type: 'get',
    url: '/product'
  }).done(function (unfilteredProducts) {
    //populateProducts(products);

    var products = categoryFilteredProducts(unfilteredProducts);

    addBrandFilter(products);
    if(getCurrentPage()){
      showPage(products, getCurrentPage());
    } else {
      showPage(products, 1);
    }

    bootPage(products);

  }).fail(function (error) {
    alert('Failed to get products');
    console.log(error);
  });

});

// Global
var productsPerPage = 1;

function categoryFilteredProducts(products) {
  var filter = '';
  var filteredProducts = [];

  if(getCookie('categoryFilter')){
    filter = getCookie('categoryFilter');
    $.each(products, function (i, product) {
      if(product.category == filter){
        filteredProducts.push(product);
      }
    });
    return filteredProducts;
  } else if(getCookie('subCategoryFilter')){
    filter = getCookie('subCategoryFilter');
    $.each(products, function (i, product) {
      if(product.subCategory == filter){
        filteredProducts.push(product);
      }
    });
    return filteredProducts;
  } else {
    return products;
  }
}

function setCurrentPage(pageNumber){
  setCookie('currentPage', pageNumber, 0.001); // expires in 2.4 minutes
}

function getTotalPages(numberOfProducts){
  return Math.ceil(numberOfProducts/productsPerPage);
}

function getCurrentPage() {
  return getCookie('currentPage');
}

function bootPage(products, filtered) {
  if(products.length > 1){
    var bootpagOptions = {};
    if(getCurrentPage() && !filtered){
      bootpagOptions = {
        total: getTotalPages(products.length),
        page: getCurrentPage(),
        maxVisible: 3
      };
    } else {
      bootpagOptions = {
        total: getTotalPages(products.length),
        page: 1,
        maxVisible: 3
      };
    }
    $('.bootpag').bootpag(
      bootpagOptions
    ).on("page", function(event, pageNum){
      setCurrentPage(pageNum);
      showPage(products, pageNum);
    });
  } else {
    $('.bootpag').empty();
    populateProducts(products);
  }
}

function showPage(list, pageNumber) {
  var pageList = [];
  var currentPage = 1;
  var numberOfPages = 0;

  if(list.length > 1){
    openThisPage(pageNumber);

    function openThisPage(pageNumber){
      currentPage = pageNumber;
      loadList();
    }

    function loadList() {
      var begin = ((currentPage - 1) * productsPerPage);
      var end = begin + productsPerPage;

      pageList = list.slice(begin, end);
      populateProducts(pageList);
    }
  } else {
    populateProducts(list);
  }

}

// ---Brand filter
function addBrandFilter(products){
  var brands = []; // Contains html
  var brandsList = []; // Contains brands in string format (for checking duplicates)

  $.each(products, function (i, product) {
    if(brandsList.indexOf(product.brand) === -1){
      brands.push(
        '<li><a href="javascript:;" class="brandFilter">'+ product.brand +'</a></li>'
      );
    }
    brandsList.push(product.brand);
  });
  $('#sortByBrand')
    .empty()
    .append( brands.join('') )
    .on('click', 'a.brandFilter', function () {
      sortByBrand(products, $(this).text());
    });
}

function sortByBrand(products, brand) {
  var sortedProducts = [];
  $.each(products, function (i, product) {
    if(product.brand === brand){
      sortedProducts.push(product);
    }
  });
  bootPage(sortedProducts, true);
}

// ---End Brand filter

// ==========
function populateProducts(products) {
  var gridItems = [];
  var listItems = [];

  // Get a specific image
  function getImg(item, criteria) {
    for(var i = 0; i < item.pics.length; i++){
      if(item.pics[i].main){
        var loc = item.pics[i].location;
        var fileName = loc.substring(0, loc.indexOf('.'));
        var extension = loc.split('.').pop();
        return fileName + '_' + criteria + '.' + extension;
      }
    }
  }

  // Get Price
  function getPrice(item, option) {
    // Format price
    function formatSum(n) {
      return n.toFixed(0).replace(/./g, function(c, i, a) {
          return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
        }) + ' Sum';
    }
    if(option === 'discounted'){
      return formatSum(item.discountPrice);
    } else {
      return formatSum(item.originalPrice);
    }
  }

  // Push items in the list
  $.each(products, function (i, item) {
    gridItems.push(

      '<!-- PRODUCT -->'
      + '<div class="col-sm-6 col-md-4">'
      +  '<div class="products">'
      +   '<div class="product">'
      +     '<div class="product-image">'
      +       '<div class="image">'
      +         '<a href="javascript:" onclick="setCurrentProduct(' + item.id + ');">'
      +           '<img src="' + getImg(item, 'medium') + '" alt="">'
      +         '</a>'
      +       '</div><!-- /.image -->'
      +       '<div class="tag new"><span style="font-size: 12px">СКИДКА</span></div>'
      +     '</div><!-- /.product-image -->'
      +     '<div class="product-info text-left">'
      +       '<h3 class="name"><a href="javascript:;" onclick="setCurrentProduct(' + item.id + ');">' + item.header + '</a></h3>'
      +       '<div class="rating rateit-small"></div>'
      +       '<div class="description"></div>'
      +       '<div class="product-price">'
      +         '<span class="price">' + getPrice(item, 'discounted') + '</span>'
      +         '<span class="price-before-discount">' + getPrice(item, 'original') + '</span>'
      +       '</div><!-- /.product-price -->'
      +     '</div><!-- /.product-info -->'
      +     '<div class="cart clearfix animate-effect">'
      +       '<div class="action">'
      +         '<ul class="list-unstyled">'
      +           '<li class="add-cart-button btn-group">'
      +              '<button class="btn btn-primary" onClick="displayNumber()" type="button">КУПИТЬ</button>'
      +           '</li>'
      +           '<li class="lnk" style="display: none">'
      +             '<a class="add-to-cart" href="tel:" title="Wishlist" style="background-color: #12a692">'
      +               '<span>+99893-373-3575</span>'
      +             '</a>'
      +           '</li>'
      +         '</ul>'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      +  '</div>'
      + '</div>'
      + '<!-- END PRODUCT -->'

    );

    listItems.push(
      '<!-- PRODUCT-->'
      + '<div class="category-product-inner">'
      +   '<div class="products">'
      +     '<div class="product-list product">'
      +       '<div class="row product-list-row">'
      +         '<div class="col col-sm-4 col-lg-4">'
      +           '<div class="product-image">'
      +             '<div class="image">'
      +               '<a href="javascript:;" onclick="setCurrentProduct(' + item.id + ');">'
      +                 '<img src="' + getImg(item, 'medium') + '" alt="">'
      +               '</a>'
      +             '</div>'
      +           '</div><!-- /.product-image -->'
      +         '</div><!-- /.col -->'
      +         '<div class="col col-sm-8 col-lg-8">'
      +           '<div class="product-info">'
      +             '<h3 class="name"><a href="javascript:;" onclick="setCurrentProduct(' + item.id + ');">' + item.header + '</a></h3>'
      +             '<div class="rating rateit-small"></div>'
      +             '<div class="product-price">'
      +               '<span class="price">' + getPrice(item, 'discounted') + '</span>'
      +               '<span class="price-before-discount">' + getPrice(item, 'original') + '</span>'
      +             '</div><!-- /.product-price -->'
      +             '<div class="description m-t-10">'
      +               item.shortDescription
      +             '</div>'
      +             '<div class="cart clearfix animate-effect">'
      +               '<div class="action">'
      +                 '<ul class="list-unstyled">'
      +                   '<li class="add-cart-button btn-group">'
      +                     '<button class="btn btn-primary" type="button" onClick="displayNumber()">КУПИТЬ</button>'
      +                   '</li>'
      +                   '<li class="lnk" style="display: none">'
      +                     '<a class="add-to-cart" href="tel:" title="Wishlist" style="background-color: #12a692">'
      +                       '<span>+99893-373-3575</span>'
      +                     '</a>'
      +                   '</li>'
      +                 '</ul>'
      +               '</div><!-- /.action -->'
      +             '</div>'
      +           '</div><!-- /.product-info -->'
      +         '</div><!-- /.col -->'
      +       '</div><!-- /.product-list-row -->'
      +     '<div class="tag new"><span style="font-size: 12px">СКИДКА</span></div>'
      +   '</div><!-- /.product-list -->'
      +  '</div><!-- /.products -->'
      + '</div><!-- /.category-product-inner -->'
      +'<!-- END PRODUCT-->'

    );

  });

  $('#gridProducts').empty().append( gridItems.join('') );
  $('#listProducts').empty().append( listItems.join('') );
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
