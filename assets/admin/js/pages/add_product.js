
$(document).ready(function(){

  initSummernote();

  $('#product').validate({
    rules: {
      header: {
        required: true
      },
      model: {
        required: true
      },
      original_price: {
        required: true
      },
      discount_price: {
        required: true
      },
      details: {
        required: true
      },
      category: {
        required: true
      },
      brand: {
        required: true
      }
    },
    messages: {

    },
    submitHandler: function () {

      var ajaxData = {
        header: $('#header').val(),
        model: $('#model').val(),
        originalPrice: $('#originalPrice').val(),
        discountPrice: $('#discountPrice').val(),
        details: $('#details').val(),
        shortDescription: $('.summernote').eq(0).summernote('code'),
        longDescription: $('.summernote').eq(1).summernote('code'),
        brand: $('#brand option:selected').html()
      };


      if($('#category option:selected').attr('data-catType') === 'sub'){
        alert('Sub category is selected');
        ajaxData.subCategory = $('#category option:selected').val();
        ajaxData.category = $('#category option:selected').attr('data-mainCatId');
      } else {
        ajaxData.category = $('#category option:selected').val();
      }

      $.ajax({
        type: 'post',
        url: '/product',
        data: ajaxData
      }).done(function (data) {
        for(var i = 0; i < locations.length; i++){

          var picData = {};
          if(mainImageLocation === locations[i]){
            picData = {
              location: locations[i],
              main: true,
              item: data.id
            };
          } else {
            picData = {
              location: locations[i],
              main: false,
              item: data.id
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
        //alert('Yangi maxsulot qo\'shildi. Nomi: ' + data.header);
        swal({
          type: 'success',
          title: 'Yangi maxsulot!',
          text: 'Yangi maxsulot qo\'shildi. Nomi: ' + data.header,
          closeOnConfirm: false
        }, function () {
          location.reload();
        });
      }).fail(function (error) {
        console.log(error);
      });
    }
  });

  populateBrands();
  populateCategories();

});

function initSummernote(){
  $('.summernote').summernote();

  $('.input-group.date').datepicker({
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    calendarWeeks: true,
    autoclose: true
  });
}

function populateCategories() {
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
      .append('<option value="0">---Kategoriya tanlang---</option>')
      .append(categories.join(''));

  }).fail(function (error) {
    console.log(error);
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
        '<option value="' + brand.id + '">' + brand.name + '</option>'
      );
    });

    $('#brand')
      .empty()
      .append('<option value="0">---Brand---</option>')
      .append(brands.join(''));

  }).fail(function (error) {
    console.log(error);
  });
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


var mainTemp = '';
$("div#dropzoneFormMain").dropzone({
  url: "/pictures/upload",
  addRemoveLinks: true,
  removedfile: function (file) {
    $(document).find(file.previewElement).remove();
    $.ajax({
      url: '/pictures/del',
      type: 'post',
      data: {
        name: mainTemp
      }
    }).done(function (response) {
      alert(response);
    }).fail(function (error) {
      console.log(error);
    });
  },
  dictDefaultMessage: "<strong>ASOSIY RASM. FAQAT 1TA RASM YUKLANG</strong>",
  maxFiles: 1,
  maxfilesexceeded: function () {
    alert('Faqat 1 rasm yuklash mumkin');
  },
  success: function (file, response) {
    console.log('Location: ' + response.files[0].fd);
    var location;
    location = response.files[0].fd;
    location = location.split('assets/').pop();
    locations.push(location);
    mainImageLocation = location;
    mainTemp = location;
  },
  error: function (file, response) {
    $(document).find(file.previewElement).remove();
  }

});

//========== END DROPZONE ==========
