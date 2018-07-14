var hotelName;
var hotelAddress;
var destination = $("#destination").val();
var checkInDate = $("#datetimepicker1").val();
var checkOutDate = $("#datetimepicker2").val();
var cryptoCurrency = $("#cryptoCurrency").val();
//checkout firebase 
var config = {
    apiKey: "AIzaSyBz7O2sKtxxkxGVsSh9ICLOlMngDG058Mc",
    authDomain: "project1-group3.firebaseapp.com",
    databaseURL: "https://project1-group3.firebaseio.com",
    projectId: "project1-group3",
    storageBucket: "project1-group3.appspot.com",
    messagingSenderId: "50484590409"
};
firebase.initializeApp(config);

var database = firebase.database();

var results;
    var bitPrice = [];
    var hotels = [];
    var usDollar;
    var itemPrices = []; // push in prices of all selected items
var totalPrice = 0 ;
var itemPrice = 0;
var priceInUsd = 0;

$(document).ready(function () {
    $(".checkoutPages").hide()
    $(".displayResults").hide()
    $("#favouritesPage").append(localStorage.getItem("hotel-name") + localStorage.getItem("hotel-address") + localStorage.getItem("hotel-amenities") + localStorage.getItem("hotel-price") + "<br>")
    
    
  

    $("#step1Button").on("click", function (event){
        event.preventDefault();

    var total = itemPrices.reduce(getSum, 0)

    totalPrice = Math.round(total * 100000) / 100000;
    console.log(totalPrice);
    
        var firstName = $("#firstName").val().trim();
        var lastName = $("#lastName").val().trim();
        var email = $("#email").val().trim();
        var address1 = $("#address1").val().trim();
        var address2 = $("#address2").val().trim();
        var city = $("#city").val().trim(); 
        var country = $("#country").val().trim();
        var postcode = $("#postcode").val().trim();
        var phone = $("#phone").val().trim();
        
        var newCustomer = {
            firstName: firstName ,
            lastName: lastName,
            email: email,
            address1: address1,
            address2: address2,
            city: city,
            country: country,
            postcode: postcode,
            phone: phone,

            hName: hotelName,
            hAddress: hotelAddress,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            bitPrice: totalPrice,
            USDprice: priceInUsd

        }
        console.log("new customer = " , newCustomer)
        database.ref("/customers").push(newCustomer);
    
    
        $("#firstName").val("");
        $("#lastName").val("");
        $("#email").val("");
        $("#address1").val("");
        $("#address2").val("");
        $("#city").val("");
        $("#country").val("");
        $("#postcode").val("");
        $("#phone").val("");
    
        //call crytopayment function 
        cryptoPayment ();
    
      });

    function bitcoinCall() {

        var bitcoinURL = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,CAD";

        $.ajax({
            url: bitcoinURL,
            method: "GET"
        }).then(function (response) {
            usDollar = response.USD;
            console.log("USD = " + usDollar)

            //bitPrice[i] = ((results[j].total_price.amount).toFixed(4)/usDollar) ;
        });
    }

    bitcoinCall();


    var $object = {

        queryHotels: function (destination, checkInDate, checkOutDate, cryptoCurrency) {
            var hotelURL = "https://api.sandbox.amadeus.com/v1.2/hotels/search-airport?apikey=8ymHpM55MRMoy1BSJLjLZidGdZr3nbVc&location=" +
                destination + "&check_in=" + checkInDate + "&check_out=" + checkOutDate + "&number_of_results=10";

            $.ajax({
                url: hotelURL,
                method: "GET"
            }).then(function (response) {
                results = response.results;
                console.log(results);

                $object.addHotelRows();
            });

        },

        addHotelRows: function () {
            var numResults = results.length;
            var i = 0;
            var j = 0;

            $("#hotelBody").empty();
            for (j = 0; j < numResults; j++) {
                console.log(results[j].property_name);
                var newRow = $("<tr>").append(
                    $("<button>").text("Add to Favourites").addClass("add-favourite").attr("data-value", j),

                    $("<td class='one'>").text(results[j].property_name),
                    $("<td class='two'>").text(results[j].address.line1),
                    $("<td class='three'>").text(results[j].amenities[0].description),
                    $("<td class='four'>").text(results[j].total_price.amount),
                    $("<td class='five'>").text(((results[j].total_price.amount) / usDollar).toFixed(5)),
                    //ADDED 
                    $("<button class='book'>").text("Book").attr("data-value", j )

                );

                $("#hotelBody").append(newRow);
            }
            // Book buttons
            $('.book').on("click", function (event) {
                console.log('book')
                event.preventDefault();
        
                hotelName = $(this).closest("tr").children("td.one").text()
                hotelAddress = $(this).closest("tr").children("td.two").text()
                priceInUsd = JSON.parse($(this).closest("tr").children("td.four").text())
                itemPrice = JSON.parse($(this).closest("tr").children("td.five").text())

      

                itemPrices.push(itemPrice)
                
                console.log ("itemPrice" , itemPrice , "itemPrices" , itemPrices)
        
                $(".displayResults").hide()
                $(".searchBoxes").hide()
                $(".checkoutPages").show()
            });

            $object.addFavourites();


        },

        addFavourites: function () {
            $(document).on("click", ".add-favourite", function () {
                var k = $(this).attr("data-value");
                console.log(results[k].property_name);
                localStorage.setItem("hotel-name", results[k].property_name);
                localStorage.setItem("hotel-address", results[k].address.line1);
                localStorage.setItem("hotel-amenities", results[k].amenities[k].description);
                localStorage.setItem("hotel-price", results[k].total_price.amount);

                $("#favouritesPage").append(localStorage.getItem("hotel-name") + localStorage.getItem("hotel-address") + localStorage.getItem("hotel-amenities") + localStorage.getItem("hotel-price") + "<br>")

                console.log(localStorage.getItem("hotel-name") + localStorage.getItem("hotel-address") + localStorage.getItem("hotel-amenities") + localStorage.getItem("hotel-price"));
            });

        }
    }



    $("#btnSubmit").on("click", function (event) {
        event.preventDefault();

        destination = $("#destination").val();
        checkInDate = $("#datetimepicker1").val();
        checkOutDate = $("#datetimepicker2").val();
        cryptoCurrency = $("#cryptoCurrency").val();
        $object.queryHotels(destination, checkInDate, checkOutDate, cryptoCurrency);
        
        $(".displayResults").show();
        $(".searchBoxes").hide();

    });

    $(".nav-favs").on("click", function (event) {
        event.preventDefault();
        $("#favouritesPage").show();
        $(".displayResults").hide();
        $(".searchBoxes").hide();
    });


    //ADDED
    //BOOK BUTTON 
    // var config = {
    //     apiKey: "AIzaSyBz7O2sKtxxkxGVsSh9ICLOlMngDG058Mc",
    //     authDomain: "project1-group3.firebaseapp.com",
    //     databaseURL: "https://project1-group3.firebaseio.com",
    //     projectId: "project1-group3",
    //     storageBucket: "project1-group3.appspot.com",
    //     messagingSenderId: "50484590409"
    //   };
    //   firebase.initializeApp(config);
    
    //   var database = firebase.database();


    //*********************DATE POP UP********************************************** */
    $('#datetimepicker1').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,

    }).on('changeDate', function (selected) {
        var minDate = new Date(selected.date.valueOf());
        $('#datetimepicker2').datepicker('setStartDate', minDate);

    });

    //CALENDAR CHECK-OUT DATE

    $('#datetimepicker2').datepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
    }).on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
        $('#datetimepicker1').datepicker('setEndDate', maxDate);
    });

    //*********************END OF DATE POP UP********************************************** */  
}); //DOC READY 

/************************CHECKOUT PAGE************************************************* */
//Global Variables 




//Global function

    //adder
function getSum(total, num) {
    return total + num;
}
  //copier
function copy(input) {
    var copyText = document.getElementById(input);
    copyText.select();
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);
  }


//STEP 1 **********************************************************************************************
//Customer information to firebase database 

  // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyBz7O2sKtxxkxGVsSh9ICLOlMngDG058Mc",
//     authDomain: "project1-group3.firebaseapp.com",
//     databaseURL: "https://project1-group3.firebaseio.com",
//     projectId: "project1-group3",
//     storageBucket: "project1-group3.appspot.com",
//     messagingSenderId: "50484590409"
//   };
//   firebase.initializeApp(config);

//   var database = firebase.database();

  $("#payment").hide()



//STEP 2 ******************************************************************************************
//cryptocurency payment page 
        //Generate QR

function cryptoPayment (){  


var addresses = ["3F94KqYPvg8MXz5vJoXihdxvkBBB9uw1fw", 
"3Qw3d1zo1unDD7s7HWjwbLafvkmQ4JGySt",
"34DFdrr1Ln3PMXJMfGau86vKBQMzjdUBac",
"36z43CsBvPjNT181QLmfaVfBDjEtyPXjdp",
"31pcEuGNZzRgyjrY8biP2MMGjpFNxNiaPn",
"3L8NBcohT7a4EZ1iGN9rmLSLbcwf73zcjz",
"3F94KqYPvg8MXz5vJoXihdxvkBBB9uw1fw",
]

var address = addresses[Math.floor(Math.random() * 6) + 1 ]
  
var qr = "https://chart.googleapis.com/chart?chs=350x350&cht=qr&" 
+ "chl=bitcoin:" + address + "&amount=" + totalPrice;

    //Display 
    $("#payment").show();
    $("#form").hide();
    
    
    var paidButton = "<button class ='btn btn-primary'>Mark as Paid</button>"

    //id='step2Button' 

    $(".progress-bar").html("Payment");
    $(".progress-bar").attr({"style": "width: 60%" , "aria-valuenow":"60"});
    $("#qr").html("<img  src =' " + qr + " ' >" );
    $("#instruction").html("<p>Send the indicated amount to the address below</p>");

    $("#totalPrice").attr({"value": totalPrice ,  "readonly":"readonly"});
    $("#bitAddress").attr({"value": address ,  "readonly":"readonly"});
    $("#step2Button").html(paidButton);

    $("#copyButton1").on("click",function (){
        copy("totalPrice");
    }); //
    $("#copyButton2").on("click",function (){
        copy("bitAddress");
    }); //
    
    $("#step2Button").on("click",function(event){
        event.preventDefault();
        console.log("workin");
        confirmed()
    });
  

}; //end of step 2


//STEP 3 *******************************************************************************************

 //CONDITION: Bitcoin notification received 
function confirmed () {
    $("#payment").hide()
    $(".progress-bar").html("Confirmed")
    $(".progress-bar").attr({"style": "width: 100%" , "aria-valuenow":"100"})


$("#content").html("SUMMARY OF PURCHASE/INVOICE HERE"+"<br>"+ "<br>" + "Thank you for your purchase. A confirmation email had been send to example@gmail.com. It will take up to 24hour.....blah blah" )


//summary of purchase//
//shootout email to customer//

}
