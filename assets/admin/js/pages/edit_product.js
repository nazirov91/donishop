var currentProductId = getCookie('editProd');

$(document).ready(function () {

  addBrandsAndCategories();
  insertProductInfo();

  waitUntilExists('switchBoxDiv', function () {
    var elem = document.querySelector('.js-switch');
    var switchery = new Switchery(elem, { color: '#1AB394' });

    var elem_2 = document.querySelector('.js-switch_2');
    var switchery_2 = new Switchery(elem_2, { color: '#f8ac59' });

    var elem_3 = document.querySelector('.js-switch_3');
    var switchery_3 = new Switchery(elem_3, { color: '#f8ac59' });

    var elem_4 = document.querySelector('.js-switch_4');
    var switchery_4 = new Switchery(elem_4, { color: '#f8ac59' });
  });

  $('#addImage').submit(function (e) {
    e.preventDefault();

    if(locations.length > 0){
      for(var i = 0; i < locations.length; i++){

        var picData = {};
        if(mainImageLocation === locations[i]){
          picData = {
            location: locations[i],
            main: true,
            item: currentProductId
          };
        } else {
          picData = {
            location: locations[i],
            main: false,
            item: currentProductId
          };
        }

        $.ajax({
          type: 'post',
          url: '/pictures',
          data: picData
        }).done(function (response) {
          console.log('+Picture added');
        }).fail(function (error) {
          console.log(error);
        });
      }

      $.ajax({
        url: '/product/' + currentProductId,
        type: 'get'
      }).done(function (product) {
        addPictures(product);
        alert('Rasm(lar) Qo\'shildi\nDIQQAT!!! YANGI QO\'SHILGAN RASMLAR 3-4 MIN DAN KEYIN KO\'RINADI.');
      }).fail(function (error) {
        console.log(error);
      });
    }
  });
});

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

function initForm() {
  $('#editProduct').submit(function (e) {
    e.preventDefault();
    var ajaxData = {
      header: $('#header').val(),
      model: $('#model').val(),
      originalPrice: $('#originalPrice').val(),
      discountPrice: $('#discountPrice').val(),
      details: $('#details').val(),
      shortDescription: $('.summernote').eq(0).summernote('code'),
      longDescription: $('.summernote').eq(1).summernote('code'),
      brand: $('#brand option:selected').html(),
      inStock: checkboxStatus('stock'),
      hot: checkboxStatus('hot'),
      new: checkboxStatus('new'),
      sale: checkboxStatus('sale')
    };


    function checkboxStatus(box) {
      return $('#' + box).is(':checked');
    }

    if($('#category option:selected').attr('data-catType') === 'sub'){
      alert('Sub category is selected');
      ajaxData.subCategory = $('#category option:selected').val();
      ajaxData.category = $('#category option:selected').attr('data-mainCatId');
    } else {
      ajaxData.category = $('#category option:selected').val();
    }

    $.ajax({
      type: 'put',
      url: '/product/' + currentProductId,
      data: ajaxData
    }).done(function (data) {
      alert('Ma\'lumotlar o\'zgardi');
      window.location = 'edit_product.html';
    }).fail(function (error) {
      console.log(error);
      alert('Ma\'lumotlar o\'zgarmadi');
    });
  });
}

function insertProductInfo() {
  $.ajax({
    url: '/product/' + currentProductId,
    type: 'get'
  }).done(function (product) {

    $('#header').val(product.header);
    $('#model').val(product.model);
    $('#originalPrice').val(product.originalPrice);
    $('#discountPrice').val(product.discountPrice);
    $('#details').val(product.details);
    $('.summernote').eq(0).summernote('code', product.shortDescription);
    $('.summernote').eq(1).summernote('code', product.longDescription);
    $('#brand option:contains("' + product.brand + '")').attr('selected', 'selected');
    $('#category option[value="' + product.category + '"]').attr('selected', 'selected');

    initForm();
    addSwitchBoxes(product);
    addPictures(product);

  }).fail(function (error) {
    console.log(error);
  });
}

function addBrandsAndCategories() {
  $.ajax({
    url: '/categories',
    type: 'get'
  }).done(function (response) {
    var categories = [];

    $.each(response, function (i, category) {

      if(category.subCategories.length > 0){ // If there are subcategories
        categories.push(
          '<optgroup label="' + category.name + '">'
          +   getSubcategories(category)
          + '</optgroup>'
        );
      } else {
        categories.push(
          '<option data-catType="main" value="' + category.id + '">' + category.name + '</option>'
        );
      }
    });

    function getSubcategories(category) {
      var subcat = '';
      $.each(category.subCategories, function (i, sub) {
        subcat += '<option data-catType="sub" data-mainCatId="' + category.id + '" value="' + sub.id + '">' + sub.name + '</option>';
      });
      return subcat;
    }

    $('#category')
      .empty()
      .append(categories.join(''));

  }).fail(function (error) {
    console.log(error);
  });

  $.ajax({
    url: '/brands',
    type: 'get'
  }).done(function (response) {
    var brands = [];

    $.each(response, function (i, brand) {
      brands.push(
        '<option value="' + brand.id + '">' + brand.name + '</option>'
      );
    });

    $('#brand')
      .empty()
      .append(brands.join(''));

  }).fail(function (error) {
    console.log(error);
  });
}

function addSwitchBoxes(product) {
  function isChecked(value){
    if(value === true){
      return 'checked';
    } else {
      return '';
    }
  }

  $('#switchBoxes')
    .empty()
    .append(
      '<div id="switchBoxDiv">'
      +'<label style="padding: 0 5px;">Наличие?</label>'
      + '<input id="stock" type="checkbox" class="js-switch" ' + isChecked(product.inStock) + ' />'
      +'<label style="margin-left: 20px; padding: 0 5px;">Hot</label>'
      + '<input id="hot" type="checkbox" class="js-switch_2" ' + isChecked(product.hot) + ' />'
      +'<label style="margin-left: 20px; padding: 0 5px;">New</label>'
      + '<input id="new" type="checkbox" class="js-switch_3" ' + isChecked(product.new) + ' />'
      +'<label style="margin-left: 20px; padding: 0 5px;">Sale</label>'
      + '<input id="sale" type="checkbox" class="js-switch_4" ' + isChecked(product.sale) + ' />'
      +'</div>'

    );
}

function addPictures(product) {
  var pictures = [];

  $.each(product.pics, function (i, pic) {
    if((pic.main === true) || (pic.location.indexOf('_icon') > -1)){
      pictures.push(
        '<tr id="' + 'pic' + pic.id + '">'
        + '<td>'
        +   '<img src="../' + getIcon(pic) + '">'
        + '</td>'
        + '<td>'
        +   '<input type="text" class="form-control" disabled value="' + pic.location + '">'
        + '</td>'
        + '<td style="text-align: center">'
        +   '<input type="radio" name="radio1" id="radio' + pic.id + '" value="option' + pic.id + '" ' + checked(pic.main) + ' style="margin-top: 20px">'
        + '</td>'
        + '<td>'
        +   '<button data-picLoc="' + pic.location + '" class="btn btn-white picDel"><i class="fa fa-trash"></i></button>'
        + '</td>'+
        '</tr>'
      );
    }
  });

  $('#picturesBody')
    .empty()
    .append(pictures.join(''))
    .on('click', 'button.picDel', function () {

      var extension = $(this).attr('data-picLoc').split('.').pop();
      var coreName = $(this).attr('data-picLoc').substring(0, $(this).attr('data-picLoc').indexOf('_'));
      var mainImage = coreName + '.' + extension;

      $.ajax({
        url: '/pictures/del',
        type: 'post',
        data: {
          name: mainImage
        }
      }).done(function (response) {
        $(this).parent().parent().remove();
        toastr.success('Picture removed!');
      }).fail(function (error) {
        console.log(error);
      });
    });

  function getIcon(p){
    if(p.main === true){
      var ext = p.location.split('.').pop();
      var coreName = p.location.substring(0, p.location.indexOf('.'));
      return coreName + '_icon.' + ext;
    } else {
      return p.location;
    }
  }
  function checked(value) {
    if(value === true){
      return 'checked=""';
    } else {
      return '';
    }
  }
}


//========== DROPZONE ==========
var locations = [];
var locationsWithFileNames = [];
var mainImageLocation = '';

Dropzone.autoDiscover = false;
$("div#dropzoneForm").dropzone({
  url: "/pictures/upload",
  addRemoveLinks: true,
  removedfile: function (file) {
    $(document).find(file.previewElement).remove();
    for(var i = 0; i < locationsWithFileNames.length; i++){
      if(file.name == locationsWithFileNames[i].name){
        console.log('Match found');
        $.ajax({
          url: '/pictures/del',
          type: 'post',
          data: {
            name: locationsWithFileNames[i].location
          }
        }).done(function (response) {
          alert(response);
        }).fail(function (error) {
          console.log(error);
        });
      }
    }
  },
  dictDefaultMessage: "Rasmlarni yuklash",
  success: function (file, response) {
    console.log('Location: ' + response.files[0].fd);

    // For deleting purposes
    locationsWithFileNames.push({
      name: file.name,
      location: response.files[0].fd.split('assets/').pop()
    });

    var location;
    if(response.files.length > 1){
      for(var i = 0; i < response.files.length; i++){
        location = response.files[i].fd;
        location = location.split('assets/').pop();
        locations.push(location);
      }
    } else {
      location = response.files[0].fd;
      location = location.split('assets/').pop();
      locations.push(location);
    }

  },
  error: function (file, response) {
    file.previewElement.classList.add("dz-error");
  }

});
