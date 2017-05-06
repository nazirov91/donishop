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

var currentProductId = getCookie('currentProduct');

$(document).ready(function () {
  if(!currentProductId){
    window.location = 'category.html';
  }

  $.ajax({
    url: '/product/' + currentProductId,
    type: 'get'
  }).done(function (product) {

    var gallery = getImages(product);
    appendGallery(gallery);
    appendProductInfo(product);
    appendUpsellProducts(product);
    //OwlGo();

    startOwl(); // We need to start owl image slider only after we append the images

  }).fail(function (error) {
    console.log(error);
    alert('Something went wrong while retrieving the current product.');
  });

});

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

function appendGallery(gallery){
  var images = [];
  var icons = [];

  $.each(gallery.images, function (i, img) {
    images.push(
      '<!-- #Slide -->'
      + '<div class="single-product-gallery-item" id="slide' + (i+1) + '">'
      +   '<a data-lightbox="image-1" data-title="Gallery" href="' + img + '">'
      +     '<img class="img-responsive" alt="" src="assets/images/blank.gif" data-echo="' + img + '" />'
      +   '</a>'
      + '</div>'
      +'<!-- End Slide -->'
    );
  });
  $('#owl-single-product').empty().append(images.join(''));

  function active(num){
    if(num === 1){
      return 'active';
    } else {
      return '';
    }
  }
  $.each(gallery.icons, function (i, icon) {
    icons.push(
      '<!--ICON-->'
      + '<div class="item">'
      +   '<a class="horizontal-thumb ' + active(i) + '" data-target="#owl-single-product" data-slide="' + (i) + '" href="#slide' + (i) + '">'
      +     '<img class="img-responsive" width="85" alt="" src="assets/images/blank.gif" data-echo="' + icon + '" />'
      +   '</a>'
      + '</div>'
      +'<!--END ICON-->'
    );
  });
  $('#owl-single-product-thumbnails').empty().append(icons.join(''));
}

function getImages(product) {
  var largeImages = [];
  var thumbnails = [];

  // We insert the main image at the beginning of the array
  // with its corresponding thumbnail
  function makeItIcon(loc){
    var fileName = loc.substring(0, loc.indexOf('.'));
    var extension = loc.split('.').pop();
    return fileName + '_icon.' + extension;
  }
  function large(loc){
    return ((loc.indexOf('_icon') <= -1) && (loc.indexOf('_small') <= -1) && (loc.indexOf('_medium')<= -1));
  }
  if(product.pics){
    for(var i = 0; i < product.pics.length; i++){
      if(product.pics[i].main){
        largeImages.unshift(product.pics[i].location);
        thumbnails.unshift(makeItIcon(product.pics[i].location));
      }
      if(large(product.pics[i].location) && !product.pics[i].main){
        largeImages.push(product.pics[i].location);
        thumbnails.push(makeItIcon(product.pics[i].location));
      }
    }
  } else {
    window.location = 'category.html';
  }


  return {
    images: largeImages,
    icons: thumbnails
  };
}

function startOwl() {
  $('#owl-single-product').owlCarousel({
    items:1,
    itemsTablet:[768,2],
    itemsDesktop : [1199,1]

  });

  $('#owl-single-product-thumbnails').owlCarousel({
    items: 4,
    pagination: true,
    rewindNav: true,
    itemsTablet : [768, 4],
    itemsDesktop : [1199,3]
  });

  $('#owl-single-product2-thumbnails').owlCarousel({
    items: 6,
    pagination: true,
    rewindNav: true,
    itemsTablet : [768, 4],
    itemsDesktop : [1199,3]
  });

  $('.single-product-slider').owlCarousel({
    stopOnHover: true,
    rewindNav: true,
    singleItem: true,
    pagination: true
  });

  $(".slider-next").click(function () {
    var owl = $($(this).data('target'));
    owl.trigger('owl.next');
    return false;
  });

  $(".slider-prev").click(function () {
    var owl = $($(this).data('target'));
    owl.trigger('owl.prev');
    return false;
  });

  $('.single-product-gallery .horizontal-thumb').click(function(){
    var $this = $(this), owl = $($this.data('target')), slideTo = $this.data('slide');
    owl.trigger('owl.goTo', slideTo);
    $this.addClass('active').parent().siblings().find('.active').removeClass('active');
    return false;
  });

}

function appendProductInfo(product){
  function inStock(){
    if(product.inStock){
      return 'Есть в наличии';
    } else {
      return 'Нет в наличии';
    }
  }

  $('#productInfo').empty().append(
    '<!--PRODUCT INFO-->'
    +'<div class="product-info">'
    + '<h1 class="name">'+ product.header +'</h1>'
    + '<div class="rating-reviews m-t-20"> <!-- Rating -->'
    +   '<div class="row">'
    +     '<div class="col-sm-3">'
    +       '<div class="rating rateit-small"></div>'
    +     '</div>'
    +   '</div>'
    + '</div><!-- End Rating-->'
    + '<div class="stock-container info-container m-t-10"><!-- Stock -->'
    +   '<div class="row">'
    +     '<div class="col-sm-3">'
    +       '<div class="stock-box">'
    +         '<span class="label" style="text-transform: none; font-size: 12px">Производитель: '+ product.brand +'</span>'
    +       '</div>'
    +     '</div>'
    +   '</div> <!--Row-->'
    +   '<div class="row">'
    +     '<div class="col-sm-3">'
    +       '<div class="stock-box">'
    +         '<span class="label" style="text-transform: none; font-size: 12px">Модель: 4523</span>'
    +       '</div>'
    +     '</div>'
    +   '</div><!--Row-->'
    +   '<div class="row">'
    +     '<div class="col-sm-3">'
    +       '<div class="stock-box">'
    +         '<span class="label" style="text-transform: none; font-size: 12px">Наличие: '+ inStock() +'</span>'
    +       '</div>'
    +     '</div>'
    +   '</div><!--Row-->'
    +  '</div> <!-- End stock container -->'
    +   '<div class="description-container m-t-20">'
    +      product.shortDescription
    +   '</div>'
    +   '<div class="price-container info-container m-t-20"><!-- Price Container -->'
    +     '<div class="row">'
    +       '<div class="col-sm-6">'
    +         '<div class="price-box">'
    +           '<span class="price" style="margin-right: 5px; font-size: 18px">'+ getPrice(product, 'discounted') +'</span><br>'
    +           '<span class="price-strike">'+ getPrice(product, 'original') +'</span>'
    +         '</div>'
    +       '</div>'
    +       '<div class="col-sm-6">'
    +         '<div class="favorite-button m-t-10 pull-right">'
    +           '<a class="btn btn-primary" data-toggle="tooltip" data-placement="right" title="Wishlist" href="#">'
    +             '<i class="fa fa-envelope"></i>'
    +           '</a>'
    +         '</div>'
    +       '</div>'
    +     '</div>'
    +   '</div><!-- Price Container-->'
    +     '<div class="cart clearfix animate-effect">'
    +       '<div class="action">'
    +         '<ul class="list-unstyled" style="margin-top: 15px">'
    +           '<li class="add-cart-button btn-group">'
    +              '<button class="btn btn-primary" onClick="displayNumber()" type="button">КУПИТЬ</button>'
    +           '</li>'
    +           '<li class="add-cart-button btn-group" style="margin-left: 10px; display: none">'
    +              '<a class="btn btn-primary" href="tel:"><span>+99893-373-3575</span></a>'
    +           '</li>'
    +         '</ul>'
    +       '</div>'
    +     '</div>'
    +   '<div class="product-social-link m-t-20 text-right" style="border-top: 1px solid #f2f2f2">'
    +     '<span class="social-label">Share :</span>'
    +     '<div class="social-icons">'
    +       '<ul class="list-inline">'
    +         '<li><a class="fa fa-facebook" href="http://facebook.com/donishopfergana/shop"></a></li>'
    +         '<li><a class="fa fa-twitter" href="#"></a></li>'
    +         '<li><a class="fa fa-pinterest" href="#"></a></li>'
    +       '</ul>'
    +     '</div>'
    +   '</div>'
    +   '</div>'

  );

  $('#longDescription').empty().append(product.longDescription);
  $('#details').empty().append(product.details);
}

function appendUpsellProducts(theProduct){
  $.ajax({
    type: 'get',
    url: '/product'
  }).done(function (products) {

    var relatedProducts = [];
    $.each(products, function (i, product) {
      if(product.category === theProduct.category && product.id !== theProduct.id){
        relatedProducts.push(product);
      }
    });

    if(relatedProducts.length > 0){
      $('#upsellProductsDiv').empty().append(
        '<h3 class="section-title">СМ. ТАКЖЕ</h3>'
        + '<div class="owl-carousel home-owl-carousel upsell-product custom-carousel owl-theme outer-top-xs" id="upsellProducts">'
        + '</div>'
      );
      populateUpsell(relatedProducts);
      OwlGo();
    }
  }).fail(function (error) {
    console.log('Could not load upsell products: ' + error);
  });

}

function populateUpsell(products){
  var upsellProducts = [];

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

  $.each(products, function (i, product) {
    upsellProducts.push(
      '<!-- Upsell Product -->'
      + '<div class="item item-carousel">'
      +   '<div class="products">'
      +     '<div class="product">'
      +       '<div class="product-image">'
      +         '<div class="image">'
      +           '<a href="javascript:;" onclick="setCurrentProduct(' + product.id + ');"><img  src="' + getImg(product, 'small') + '" alt=""></a>'
      +         '</div><!--Image-->'
      +       '</div><!-- /.product-image -->'

      +       '<div class="product-info text-left">'
      +         '<h3 class="name"><a href="javascript:;" onclick="setCurrentProduct(' + product.id + ');">'+ product.header +'</a></h3>'
      +         '<div class="rating rateit-small"></div>'
      +         '<div class="description"></div>'
      +         '<div class="product-price"><!--PRICE-->'
      +           '<span class="price">' + getPrice(product, 'discounted') + '</span>'
      +           '<span class="price-before-discount">' + getPrice(product, 'original') + '</span>'
      +         '</div><!-- /.product-price -->'
      +       '</div><!-- /.product-info -->'

      +       '<div class="cart clearfix animate-effect">'
      +         '<div class="action">'
      +           '<ul class="list-unstyled">'
      +             '<li class="add-cart-button btn-group">'
      +               '<a href="tel:" class="btn btn-primary" type="button">+99893-373-3575</a>'
      +             '</li>'
      +           '</ul>'
      +         '</div><!-- /.action -->'
      +       '</div>'
      +     '</div>'
      +   '</div>'
      + '</div>'
      +'<!--End Upsell Product-->'

    );
  });
  $('#upsellProducts').empty().append(upsellProducts.join(''));
}

function OwlGo() {
  var dragging = true;
  var owlElementID = "#owl-main";

  function fadeInReset() {
    if (!dragging) {
      $(owlElementID + " .caption .fadeIn-1, " + owlElementID + " .caption .fadeIn-2, " + owlElementID + " .caption .fadeIn-3").stop().delay(800).animate({ opacity: 0 }, { duration: 400, easing: "easeInCubic" });
    }
    else {
      $(owlElementID + " .caption .fadeIn-1, " + owlElementID + " .caption .fadeIn-2, " + owlElementID + " .caption .fadeIn-3").css({ opacity: 0 });
    }
  }

  function fadeInDownReset() {
    if (!dragging) {
      $(owlElementID + " .caption .fadeInDown-1, " + owlElementID + " .caption .fadeInDown-2, " + owlElementID + " .caption .fadeInDown-3").stop().delay(800).animate({ opacity: 0, top: "-15px" }, { duration: 400, easing: "easeInCubic" });
    }
    else {
      $(owlElementID + " .caption .fadeInDown-1, " + owlElementID + " .caption .fadeInDown-2, " + owlElementID + " .caption .fadeInDown-3").css({ opacity: 0, top: "-15px" });
    }
  }

  function fadeInUpReset() {
    if (!dragging) {
      $(owlElementID + " .caption .fadeInUp-1, " + owlElementID + " .caption .fadeInUp-2, " + owlElementID + " .caption .fadeInUp-3").stop().delay(800).animate({ opacity: 0, top: "15px" }, { duration: 400, easing: "easeInCubic" });
    }
    else {
      $(owlElementID + " .caption .fadeInUp-1, " + owlElementID + " .caption .fadeInUp-2, " + owlElementID + " .caption .fadeInUp-3").css({ opacity: 0, top: "15px" });
    }
  }

  function fadeInLeftReset() {
    if (!dragging) {
      $(owlElementID + " .caption .fadeInLeft-1, " + owlElementID + " .caption .fadeInLeft-2, " + owlElementID + " .caption .fadeInLeft-3").stop().delay(800).animate({ opacity: 0, left: "15px" }, { duration: 400, easing: "easeInCubic" });
    }
    else {
      $(owlElementID + " .caption .fadeInLeft-1, " + owlElementID + " .caption .fadeInLeft-2, " + owlElementID + " .caption .fadeInLeft-3").css({ opacity: 0, left: "15px" });
    }
  }

  function fadeInRightReset() {
    if (!dragging) {
      $(owlElementID + " .caption .fadeInRight-1, " + owlElementID + " .caption .fadeInRight-2, " + owlElementID + " .caption .fadeInRight-3").stop().delay(800).animate({ opacity: 0, left: "-15px" }, { duration: 400, easing: "easeInCubic" });
    }
    else {
      $(owlElementID + " .caption .fadeInRight-1, " + owlElementID + " .caption .fadeInRight-2, " + owlElementID + " .caption .fadeInRight-3").css({ opacity: 0, left: "-15px" });
    }
  }

  function fadeIn() {
    $(owlElementID + " .active .caption .fadeIn-1").stop().delay(500).animate({ opacity: 1 }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeIn-2").stop().delay(700).animate({ opacity: 1 }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeIn-3").stop().delay(1000).animate({ opacity: 1 }, { duration: 800, easing: "easeOutCubic" });
  }

  function fadeInDown() {
    $(owlElementID + " .active .caption .fadeInDown-1").stop().delay(500).animate({ opacity: 1, top: "0" }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeInDown-2").stop().delay(700).animate({ opacity: 1, top: "0" }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeInDown-3").stop().delay(1000).animate({ opacity: 1, top: "0" }, { duration: 800, easing: "easeOutCubic" });
  }

  function fadeInUp() {
    $(owlElementID + " .active .caption .fadeInUp-1").stop().delay(500).animate({ opacity: 1, top: "0" }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeInUp-2").stop().delay(700).animate({ opacity: 1, top: "0" }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeInUp-3").stop().delay(1000).animate({ opacity: 1, top: "0" }, { duration: 800, easing: "easeOutCubic" });
  }

  function fadeInLeft() {
    $(owlElementID + " .active .caption .fadeInLeft-1").stop().delay(500).animate({ opacity: 1, left: "0" }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeInLeft-2").stop().delay(700).animate({ opacity: 1, left: "0" }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeInLeft-3").stop().delay(1000).animate({ opacity: 1, left: "0" }, { duration: 800, easing: "easeOutCubic" });
  }

  function fadeInRight() {
    $(owlElementID + " .active .caption .fadeInRight-1").stop().delay(500).animate({ opacity: 1, left: "0" }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeInRight-2").stop().delay(700).animate({ opacity: 1, left: "0" }, { duration: 800, easing: "easeOutCubic" });
    $(owlElementID + " .active .caption .fadeInRight-3").stop().delay(1000).animate({ opacity: 1, left: "0" }, { duration: 800, easing: "easeOutCubic" });
  }

  $(owlElementID).owlCarousel({

    autoPlay: 5000,
    stopOnHover: true,
    navigation: true,
    pagination: true,
    singleItem: true,
    addClassActive: true,
    transitionStyle: "fade",
    navigationText: ["<i class='icon fa fa-angle-left'></i>", "<i class='icon fa fa-angle-right'></i>"],

    afterInit: function() {
      fadeIn();
      fadeInDown();
      fadeInUp();
      fadeInLeft();
      fadeInRight();
    },

    afterMove: function() {
      fadeIn();
      fadeInDown();
      fadeInUp();
      fadeInLeft();
      fadeInRight();
    },

    afterUpdate: function() {
      fadeIn();
      fadeInDown();
      fadeInUp();
      fadeInLeft();
      fadeInRight();
    },

    startDragging: function() {
      dragging = true;
    },

    afterAction: function() {
      fadeInReset();
      fadeInDownReset();
      fadeInUpReset();
      fadeInLeftReset();
      fadeInRightReset();
      dragging = false;
    }

  });

  if ($(owlElementID).hasClass("owl-one-item")) {
    $(owlElementID + ".owl-one-item").data('owlCarousel').destroy();
  }

  $(owlElementID + ".owl-one-item").owlCarousel({
    singleItem: true,
    navigation: false,
    pagination: false
  });

  $('#transitionType li a').click(function () {

    $('#transitionType li a').removeClass('active');
    $(this).addClass('active');

    var newValue = $(this).attr('data-transition-type');

    $(owlElementID).data("owlCarousel").transitionTypes(newValue);
    $(owlElementID).trigger("owl.next");

    return false;

  });


  $('.home-owl-carousel').each(function(){

    var owl = $(this);
    var  itemPerLine = owl.data('item');
    if(!itemPerLine){
      itemPerLine = 4;
    }
    owl.owlCarousel({
      items : itemPerLine,
      itemsTablet:[768,2],
      navigation : true,
      pagination : false,

      navigationText: ["", ""]
    });
  });

  $('.homepage-owl-carousel').each(function(){

    var owl = $(this);
    var  itemPerLine = owl.data('item');
    if(!itemPerLine){
      itemPerLine = 4;
    }
    owl.owlCarousel({
      items : itemPerLine,
      itemsTablet:[768,2],
      itemsDesktop : [1199,2],
      navigation : true,
      pagination : false,

      navigationText: ["", ""]
    });
  });

  $(".blog-slider").owlCarousel({
    items : 3,
    itemsDesktopSmall :[979,2],
    itemsDesktop : [1199,2],
    navigation : true,
    slideSpeed : 300,
    pagination: false,
    navigationText: ["", ""]
  });

  $(".best-seller").owlCarousel({
    items : 3,
    navigation : true,
    itemsDesktopSmall :[979,2],
    itemsDesktop : [1199,2],
    slideSpeed : 300,
    pagination: false,
    paginationSpeed : 400,
    navigationText: ["", ""]
  });

  $(".sidebar-carousel").owlCarousel({
    items : 1,
    itemsTablet:[768,2],
    itemsDesktopSmall :[979,2],
    itemsDesktop : [1199,1],
    navigation : true,
    slideSpeed : 300,
    pagination: false,
    paginationSpeed : 400,
    navigationText: ["", ""]
  });

  $(".brand-slider").owlCarousel({
    items : 6,
    navigation : true,
    slideSpeed : 300,
    pagination: false,
    paginationSpeed : 400,
    navigationText: ["", ""]
  });
  $("#advertisement").owlCarousel({
    items : 1,
    itemsDesktopSmall :[979,2],
    itemsDesktop : [1199,1],
    navigation : true,
    slideSpeed : 300,
    pagination: true,
    paginationSpeed : 400,
    navigationText: ["", ""]
  });

  var $owl_controls_custom = $('.owl-controls-custom');
  $('.owl-next' , $owl_controls_custom).click(function(event){
    var selector = $(this).data('owl-selector');
    var owl = $(selector).data('owlCarousel');
    owl.next();
    return false;
  });
  $('.owl-prev' , $owl_controls_custom).click(function(event){
    var selector = $(this).data('owl-selector');
    var owl = $(selector).data('owlCarousel');
    owl.prev();
    return false;
  });

  $(".owl-next").click(function(){
    $($(this).data('target')).trigger('owl.next');
    return false;
  });

  $(".owl-prev").click(function(){
    $($(this).data('target')).trigger('owl.prev');
    return false;
  });

}


