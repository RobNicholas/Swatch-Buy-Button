(function($){
    $(document).ready(function(){
        videlxu.init();
    });
})(jQuery);
    var videlxu = {
        ini:0,
        minInput: function(){
          $('.numbersOnly').keyup(function () {
            if (this.value != this.value.replace(/[^0-9\.]/g, '')) {
              this.value = this.value.replace(/[^0-9\.]/g, '');
            }
            if(this.value === ""){
              this.value = 1;
            }
          });
          $( "#yards_1" ).change(function() {
            var max = parseInt($(this).attr('max'));
            var min = parseInt($(this).attr('min'));
            if ($(this).val() > max)
            {
              $(this).val(max);
            }
            else if ($(this).val() < min)
            {
              $(this).val(min);
            }       
          });
          $("a.image-link.more-info").click(function(){
            var image = $(this).find("img").attr("src");
          });
        },
		addTocart: function(){
          $("#continue-shopping").click(function(e){
            e.preventDefault();
            window.location.href = '/collections/all';
          });
          $(".send-nuy-swatch").click(function(e){
            e.preventDefault();
            $(".loading-yards").show();
            var arr = [];
            var prop = "";
            var color = "";
            
            if($(this).parent(".input-row").parent("form").find(".input-row.apolo-media").find(".selector-wrapper").find(".single-option-selector").eq(0).length > 0){
              color = $(this).parent(".input-row").parent("form").find(".input-row.apolo-media").find(".selector-wrapper").find(".single-option-selector").eq(0).find("option:selected").val();
            }else{
              color = 0;
            }

            var price = $(this).data("price");
            var priceNature = $(this).data("price-nature");
            var title = $(this).data("title");
            var handle = $(this).data("handle");
            arr = { variantid : 28633044099, price:price, color:color }
            $.ajax({
              url: "//apolomultimedia-server1.info/yards/controller/ShopifyController.php?action=createSwatch",
              jsonp: "callback",
              dataType: "jsonp",
              data:arr,
              success: function( response ) {
                var arr = [];
                if($(".selector-wrapper").find(".single-option-selector").eq(0).length > 0){
                  color = $(".selector-wrapper").find(".single-option-selector").eq(0).find("option:selected").val();
                  prop = {
                    "_vid":response.variant_id_original,
                    "_yards":response.properties,
                    "_n":Math.floor((Math.random() * 100000) + 1),
                    "_handle":handle,
                    "title":title,
                    "_per_variant_price":priceNature,
                    "_type": "swatch",
                    "color":color
                  };
                }else{
                  prop = {
                    "_vid":response.variant_id_original,
                    "_yards":response.properties,
                    "_n":Math.floor((Math.random() * 100000) + 1),
                    "_handle":handle,
                    "_per_variant_price":priceNature,
                    "_type": "swatch",
                    "title":title
                  };
                }
                
                arr.push({
                  "id":response.id,
                  "qty":1,
                  "properties":prop

                });
                MGUtil.begin(arr);
              }
            });
          });
          $("select.select-data-apolo").change(function(e){
            e.preventDefault();
            var name = $(this).data("name");
            var value = $(this).find("option:selected").val();
            var concatenate = $(this).parent(".my-yards.quantity").find("input.myyard-input.data-apolo.numbersOnly").val();
            var total = concatenate+"-"+value;
            if(total === name){
              $(this).parent(".my-yards.quantity").parent(".content-desc").find(".quantity").find(".select-on-focus").val(1);
            }else{
              $(this).parent(".my-yards.quantity").parent(".content-desc").find(".quantity").find(".select-on-focus").val(0);
            }
          });
          $( "input.myyard-input.data-apolo.numbersOnly" ).keyup(function() {
            var name = $(this).parent(".my-yards.quantity").find("select.select-data-apolo").data("name")
            var value = $(this).val();
            var concatenate = $(this).parent(".my-yards.quantity").find("select.select-data-apolo").find("option:selected").val();
            var total = value+"-"+concatenate;
            if(total === name){
              $(this).parent(".my-yards.quantity").parent(".content-desc").find(".quantity").find(".select-on-focus").val(1);
            }else{
              $(this).parent(".my-yards.quantity").parent(".content-desc").find(".quantity").find(".select-on-focus").val(0);
            }
          });
          $(".send_product").click(function(e){
            e.preventDefault();
            $(this).parent(".input-row").parent("form").find(".input-row.btm-qty-hide").find(".my-yards span.loading-yards").show();
            var arr = [];
            var yards_1 = $(this).parent(".input-row").parent("form").find(".input-row.btm-qty-hide").find(".my-yards .yards_1").val();
            var yards_2 = $(this).parent(".input-row").parent("form").find(".input-row.btm-qty-hide").find(".my-yards .yards_2").find("option:selected").val();
            var variantid = $(this).parent(".input-row").parent("form").find(".input-row.btm-qty-hide").find(".variantsApp").val();
            var pricepervariant = $(this).data("price");
            
            arr = {variantid : variantid, yards_1 : yards_1, yards_2 : yards_2 }

            $(".yards_1").css("border","1px solid #d9d9d2");
            $(".yards_2").css("border","1px solid #d9d9d2");
            if(yards_1 === ""){
              $(".yards_1").css("border","1px solid red");
              return false;
            }
            if(yards_2 === ""){
              $(".yards_2").css("border","1px solid red");
              return false;
            }
            $.ajax({
              url: "//apolomultimedia-server1.info/yards/controller/ShopifyController.php?action=createProducts",
              jsonp: "callback",
              dataType: "jsonp",
              data:arr,
              success: function( response ) {
                //response.product.variants[0].id
                var arr = [];
                var prop = {
                  "_vid":response.variant_id_original,
                  "_yards":response.properties,
                  "_handle":response.handle,
                  "_type": "product",
                  "_per_variant_price":pricepervariant
                };
                arr.push({
                  "id":response.id,
                  "qty":1,
                  "properties":prop

                });
                MGUtil.begin(arr);
              }
            });
          });
          $("button#updateCart").click(function(e){
            e.preventDefault();
            var count = [];
            var contentJson = "";
            var contentDataKey ="";
            $(".loading-yards").show();
            $( "ul.item-list.divider").find("li .content-desc .my-yards.quantity").each(function( index ) {
              var id_2 = $(this).data("item");
              var compare_2 = $("#per_yards_"+id_2).val();
              var yards_1_2 = $(this).find(".myyard-input.data-apolo").val();
              var yards_2_2 = $(this).find("select.select-data-apolo").find("option:selected").val();
              var value_2 = yards_1_2+"-"+yards_2_2;
              var arr_2 = [];
              if(compare_2 !== value_2){
                count.push(index);
              }
            });
            if(count.length > 0){
              $( "ul.item-list.divider").find("li .content-desc .my-yards.quantity").each(function( index ) {

                var id = $(this).data("item");
                var line = $(this).data("line");
                var price = $(this).data("price");
                var compare = $("#per_yards_"+id).val();
                var yards_1 = $(this).find(".myyard-input.data-apolo").val();
                var yards_2 = $(this).find("select.select-data-apolo").find("option:selected").val();
                var value = yards_1+"-"+yards_2;
                var qty = 0;
                var variant_id = $(this).data("id");
                var arr = [];
                if(compare !== value){

                  setTimeout(function() {
                    videlxu.change(id,qty,variant_id,yards_1,yards_2,line,price,count,contentJson,contentDataKey,function(){});
                  }, 250);

                }

              });
            }else{
              $("#update-cart").trigger("click");
            }
          });
		},
        change:function(id,qty,variant_id,yards_1,yards_2,line,price,count,contentJson,contentDataKey,callback){
          var arr = [];
          var params = "updates["+id+"]="+qty+"";
          $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            async:false,
            dataType: 'json',
            data: params,
            success: function(cart) {
              arr = {variantid : variant_id, yards_1 : yards_1, yards_2 : yards_2 };
              if(typeof callback === 'function'){
                callback();
              }
              videlxu.updatecart(arr,price,function(){
                videlxu.ini += 1;
                
                if(videlxu.ini == count.length){
                  contentJson = $(".cart-jquery").text();
                  contentDataKey = jQuery.parseJSON("["+contentJson.slice(0,-1)+"]");  
                  MGUtilCART.begin(contentDataKey);
                }
              });
            },
            error: function(response) {
              alert(response);
            }
          });
        },
        updatecart:function(arr,price,callback){
          $.ajax({
            url: "//apolomultimedia-server1.info/yards/controller/ShopifyController.php?action=createProducts",
            jsonp: "callback",
            dataType: "jsonp",
            data:arr,
            success: function( response ) {
              //response.product.variants[0].id
              var arr = [];
              var contentValue = ""
              var prop = {
                "_vid":response.variant_id_original,
                "_yards":response.properties,
                "_handle":response.handle,
                "_type": "product",
                "_per_variant_price":price
              };
              arr = {
                "id":response.id,
                "qty":1,
                "properties":prop

              };
              contentValue = JSON.stringify(arr)+",";
              $(".cart-jquery").append(contentValue);
              if(typeof callback === 'function'){
                callback();
              }
            }
          });
        },
        init: function(){
			this.addTocart();
            this.minInput();
        }
}
var MGUtil={
    data:[],
    ini:0,
    total:0,
    addItem:function(qty,id,properties,callback) {
      var params = {"quantity":qty,"id":id};
      if(properties != false){
        params.properties = properties;
      }
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        async:false,
        data: params,
        success: function(){
          if(typeof callback === 'function'){
            callback();
            $(".loading-yards").show();
          }
        },
        error: function(){}
      });
    },
    recursive:function(){
      MGUtil.addItem(MGUtil.data[MGUtil.ini].qty,MGUtil.data[MGUtil.ini].id,MGUtil.data[MGUtil.ini].properties,function(){
        //console.log(MGUtil.data[MGUtil.ini]);
        MGUtil.ini += 1;
        if(MGUtil.ini < MGUtil.total){
          MGUtil.recursive();
        }else{
          /*RESPONSE AJAX RECURSIVE*/
          document.location.href = '/cart';//AFTER TO ADD ITEMS, GO TO THE CART 
        }
      });
    },
    begin:function(arr){
      /*SAMPLE*/
      /* SET YOUR ARRAY QTY's' ID's PROPERTIES(FALSE IF IS EMPTY)*/
      MGUtil.data = arr;
      MGUtil.total = MGUtil.data.length;
      MGUtil.recursive();
    }
}

var MGUtilCART={
    data:[],
    ini:0,
    total:0,
    addItem:function(qty,id,properties,callback) {
      var params = {"quantity":qty,"id":id};
      if(properties != false){
        params.properties = properties;
      }
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        dataType: 'json',
        async:false,
        data: params,
        success: function(){
          if(typeof callback === 'function'){
            callback();
            $(".loading-yards").show();
          }
        },
        error: function(){}
      });
    },
    recursive:function(){
      MGUtilCART.addItem(MGUtilCART.data[MGUtilCART.ini].qty,MGUtilCART.data[MGUtilCART.ini].id,MGUtilCART.data[MGUtilCART.ini].properties,function(){
        //console.log(MGUtil.data[MGUtil.ini]);
        MGUtilCART.ini += 1;
        if(MGUtilCART.ini < MGUtilCART.total){
          MGUtilCART.recursive();
        }else{
          /*RESPONSE AJAX RECURSIVE*/
          $("#update-cart").trigger("click");
        }
      });
    },
    begin:function(arr){
      /*SAMPLE*/
      /* SET YOUR ARRAY QTY's' ID's PROPERTIES(FALSE IF IS EMPTY)*/
      MGUtilCART.data = arr;
      MGUtilCART.total = MGUtilCART.data.length;
      MGUtilCART.recursive();
    }
}