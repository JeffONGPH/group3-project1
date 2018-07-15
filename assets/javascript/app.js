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
var totalPrice = 0;
var itemPrice = 0;
var priceInUsd = 0;

var bookingID;

$(document).ready(function () {
    $("#about").hide();
    $("#contact").hide();
    $(".checkoutPages").hide()
    $(".displayResults").hide()
    $("#findBooking").hide();
    $(".confirmationPage").hide();
    $("#favouritesPage").append(localStorage.getItem("hotel-name") + localStorage.getItem("hotel-address") + localStorage.getItem("hotel-amenities") + localStorage.getItem("hotel-price") + "<br>")
    $("#myFavourites").hide();
    $("#cbookings").hide()

    //Remove all favourites data
    database.ref("/favourites").remove();
    // EVENT LISTENER FOR ABOUT PAGE AND CONTACT US PAGE

    $("#aboutapp").on("click", function () {
        $("#about").show();
        $(".searchBoxes").hide();
        $(".checkoutPages").hide()
        $(".displayResults").hide()
        $("#myFavourites").hide();
        $("#findBooking").hide();
        $(".confirmationPage").hide();

        $("#cbookings").hide()
    })

    $(".backtoSearch").on("click", function () {
        $(".heading").show();
        $(".searchBoxes").show();
        $("#about").hide();
        $("#contact").hide();
        $(".checkoutPages").hide()
        $(".displayResults").hide()
        $("#myFavourites").hide();
        $("#findBooking").hide();
        $(".confirmationPage").hide();

        $("#cbookings").hide()
    })


    $("#contactapp").on("click", function () {
        $("#about").hide();
        $("#contact").show();
        $(".searchBoxes").hide();
        $(".checkoutPages").hide()
        $(".displayResults").hide()
        $("#myFavourites").hide();
        $("#findBooking").hide();
        $(".confirmationPage").hide();

        $("#cbookings").hide()
    })

    //find bookings

    $(".gotobook").on("click", function () {
        $(".searchBoxes").hide();
        $("#about").hide();
        $("#contact").hide();
        $(".checkoutPages").hide()
        $(".displayResults").hide()
        $("#myFavourites").hide();
        $("#findBooking").show();
        $(".confirmationPage").hide();

        $("#cbookings").hide()
    })

    $("#myFavourites").hide();

    $("#star").on("click", function () {
        $("#myFavourites").show();
        $("#about").hide();
       

    })

    //checkout process

    $("#step1Button").on("click", function (event) {
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

        if (firstName && lastName && email && address1 && city && country && postcode && phone !=="")
        {

        var newCustomer = {
            firstName: firstName,
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

        
        console.log("new customer = ", newCustomer)
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


        //get bookingID 

        database.ref("/customers").limitToLast(1).on("child_added", function (snapshot) {

            bookingID = snapshot.key
            console.log("bookingID", bookingID)
        });


        //call crytopayment function 
        cryptoPayment();

    }else {
        alert("Please fill out all fields")
    }

    });

    function bitcoinCall() {

        var bitcoinURL = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,CAD";

        $.ajax({
            url: bitcoinURL,
            method: "GET"
        }).then(function (response) {
            usDollar = response.USD;
            console.log("USD = " + usDollar)
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
                    $("<button class='book'>").text("Book").attr("data-value", j)

                );

                $("#hotelBody").append(newRow);

            }
            // Book buttons
            $('.book').on("click", function (event) {
                console.log('book')
                event.preventDefault();
                $("#myFavourites").hide();
                $(".heading").hide();

                hotelName = $(this).closest("tr").children("td.one").text()
                hotelAddress = $(this).closest("tr").children("td.two").text()
                priceInUsd = JSON.parse($(this).closest("tr").children("td.four").text())
                itemPrice = JSON.parse($(this).closest("tr").children("td.five").text())



                itemPrices.push(itemPrice)

                console.log("itemPrice", itemPrice, "itemPrices", itemPrices)

                $(".displayResults").hide()
                $(".searchBoxes").hide()
                $(".checkoutPages").show()
                $(".order-details").hide()

                //order review column 
                var priceSum = itemPrices.reduce(getSum, 0)

                var summaryTotal = Math.round(priceSum * 100000) / 100000;
                console.log(summaryTotal);

                var orderTable = "<h3><strong>" + hotelName + "</strong></h3>" + "<br>" +
                    "<div> Check In: " + checkInDate + "</div>" +
                    "<div> Check Out: " + checkOutDate + "</div>" +
                    "<br>" +
                    "<strong>Price Summary</strong>" +
                    "<div>" + summaryTotal + " Bitcoins </div>" +
                    "<div>" + priceInUsd + " US Dollars </div>"


                $("#order-cart").html(orderTable)
            });

            $object.addFavourites();


        },
        //favourites
        addFavourites: function () {
            var totalFavs = 0;
            $(document).on("click", ".add-favourite", function () {
                $("#myFavourites").show();
                $("#nofav").hide()

                totalFavs++;
                var k = $(this).attr("data-value");

                var favPrice = JSON.parse($(this).closest("tr").children("td.five").text())

                // localStorage.setItem("hotel-name", results[k].property_name);
                // localStorage.setItem("hotel-address", results[k].address.line1);
                // localStorage.setItem("hotel-amenities", results[k].amenities[Math.floor(Math.random() * 4) + 1].description);
                // localStorage.setItem("hotel-price", results[k].total_price.amount);
                // localStorage.setItem("hotel-bitprice", favPrice);

                database.ref("/favourites/" + k).set({
                    name: results[k].property_name,
                    address: results[k].address.line1,
                    amenities: results[k].amenities[Math.floor(Math.random() * 4) + 1].description,
                    price: results[k].total_price.amount,
                    bitprice: JSON.parse($(this).closest("tr").children("td.five").text()),
                    dataAttr: k,
                });

            });

            // Access each time a fav is added, only reference specific one
            database.ref("/favourites//").on("child_added", function (snapshot) {
                console.log('on child_added')
                //$("#favTable").empty();

                console.log("TEST", snapshot.val().bitprice)


                var newRow = $("<tr>").append(
                    $("<button>").text("Remove Favourite").addClass("remove-favourite").attr("data-info", (snapshot.val().dataAttr) * 0.1),
                    $("<td>").text(snapshot.val().name),
                    $("<td>").text(snapshot.val().address),
                    $("<td>").text(snapshot.val().amenities),
                    $("<td>").text(snapshot.val().price),
                    $("<td>").text(snapshot.val().bitprice)
                );
                console.log(newRow);
                $("#favTable").show()
                $("#favTable").append(newRow);

            });

            $object.removeFavourites();

        },


        removeFavourites: function () {

            $(document).on("click", ".remove-favourite", function () {
                var kk = $(this).attr("data-info");

                var kten = Math.floor(kk * 10)

                document.getElementById("favTable").deleteRow(kk);

                database.ref("/favourites/" + kten).remove()

            });

        }

        //favourites end


    } //$object



    $(".nav-favs").on("click", function (event) {
        event.preventDefault();
        $("#favouritesPage").show();
        $(".displayResults").hide();
        $(".searchBoxes").hide();
    });

    // JAVASCRIPT FOR SCROLL
    $("a").on('click', function (event) {
        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();
            // Store hash
            var hash = this.hash;
            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 1000, function () {
                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });

    //*********************DATE POP UP********************************************** */
    // JAVASCRIPT FOR CALENDAR
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

    // JAVASCRIPT FOR ERROR MESSAGES
    $("#btnSubmit").on("click", function () {
        // event.preventDefault();
        var inputValid = false;
        var destinationInput = $("#destination").val().trim();
        var checkIn = $("#datetimepicker1").val().trim();
        var checkOut = $("#datetimepicker2").val().trim();
        if ((destinationInput.length != 3) || (destinationInput == "")) {
            inputValid = false;
            $("#destinationError").text("Invalid Airport Code. Please enter a valid three letter airport code.")
                .css({
                    'font-weight': 'normal'
                })
                .css({
                    'color': 'red'
                })
        }
        if (checkIn == "") {
            inputValid = false;
            $("#checkinError").text("Please input a date in the format 'YYYY-MM-DD'")
                .css({
                    'font-weight': 'normal'
                })
                .css({
                    'color': 'red'
                })
        }
        if (checkOut == "") {
            inputValid = false;
            $("#checkoutError").text("Please input a date in the format 'YYYY-MM-DD'")
                .css({
                    'font-weight': 'normal'
                })
                .css({
                    'color': 'red'
                })
        } if (checkIn == checkOut)
        {
            inputValid = false;
            $("#checkoutError").text("check out date must be a minimum of one day from the check in data")
                .css({
                    'font-weight': 'normal'
                })
                .css({
                    'color': 'red'
                })}else {
            inputValid = true;
            $("#destination").css({
                    'color': 'black'
                })
                .css({
                    'font-weight': 'normal'
                })
            $("#datetimepicker1").css({
                    'color': 'black'
                })
                .css({
                    'font-weight': 'normal'
                })
            $("#datetimepicker2").css({
                    'color': 'black'
                })
                .css({
                    'font-weight': 'normal'
                })
            destination = $("#destination").val();
            checkInDate = $("#datetimepicker1").val();
            checkOutDate = $("#datetimepicker2").val();
            cryptoCurrency = $("#cryptoCurrency").val();
            $object.queryHotels(destination, checkInDate, checkOutDate, cryptoCurrency);
            $(".displayResults").show();
            $(".searchBoxes").hide();
        }
    })

    //*********************END OF DATE POP UP********************************************** */  
}); //DOC READY 

/************************CHECKOUT PAGE************************************************* */

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


$("#payment").hide()



//STEP 2 ******************************************************************************************
//cryptocurency payment page 
//Generate QR

function cryptoPayment() {


    var addresses = ["3F94KqYPvg8MXz5vJoXihdxvkBBB9uw1fw",
        "3Qw3d1zo1unDD7s7HWjwbLafvkmQ4JGySt",
        "34DFdrr1Ln3PMXJMfGau86vKBQMzjdUBac",
        "36z43CsBvPjNT181QLmfaVfBDjEtyPXjdp",
        "31pcEuGNZzRgyjrY8biP2MMGjpFNxNiaPn",
        "3L8NBcohT7a4EZ1iGN9rmLSLbcwf73zcjz",
        "3F94KqYPvg8MXz5vJoXihdxvkBBB9uw1fw",
    ]

    var address = addresses[Math.floor(Math.random() * 6) + 1]

    var qr = "https://chart.googleapis.com/chart?chs=350x350&cht=qr&" +
        "chl=bitcoin:" + address + "&amount=" + totalPrice;

    //Display 
    $("#payment").show();
    $("#form").hide();
    //$(".order-review").hide();


    var paidButton = "<button class ='btn customButton'>Mark as Paid</button>"

    //id='step2Button' 

    $(".progress-bar").html("Payment");
    $(".progress-bar").attr({
        "style": "width: 60%",
        "aria-valuenow": "60"
    });
    $("#qr").html("<img  src =' " + qr + " ' >");
    $("#instruction").html("<p>Send the indicated amount to the address below</p>");

    $("#totalPrice").attr({
        "value": totalPrice,
        "readonly": "readonly"
    });
    $("#bitAddress").attr({
        "value": address,
        "readonly": "readonly"
    });
    $("#step2Button").html(paidButton);

    $("#copyButton1").on("click", function () {
        copy("totalPrice");
    }); //
    $("#copyButton2").on("click", function () {
        copy("bitAddress");
    }); //

    $("#step2Button").on("click", function (event) {
        event.preventDefault();
        console.log("workin");
        confirmed()
    });


}; //end of step 2


//STEP 3 *******************************************************************************************

//CONDITION: Bitcoin notification received 
function confirmed() {
    $("#payment").hide()
    $(".progress-bar").html("Confirmed")
    $(".progress-bar").attr({
        "style": "width: 100%",
        "aria-valuenow": "100"
    })


    $(".confirmationPage").show()
    $(".order-details").show()

    

    retrieve(bookingID);

    //shootout email to customer//POST-MVP

}

//check bookings function
function retrieve(ID) {

    database.ref("/customers").child(ID).once("value", function(snapshot) {
        console.log("childvalue ",snapshot.val())
        
        if (snapshot.val() !== null) {
            //database.ref("/customers/" + ID ).on("value", function () {

                console.log("bgtest", snapshot.val().hName )
                $(".booking-id").html("<h1><strong>Booking-ID: " + ID + "</strong></h1>")
    
                $(".booked-heading").html("ID: ")
                $(".booked-id").html(ID)
    
                $(".booked-hotelname").html(snapshot.val().hName)
                $(".booked-address").html(snapshot.val().hAddress)
                $(".booked-checkin").html(snapshot.val().checkIn)
                $(".booked-checkout").html(snapshot.val().checkOut)
                $(".booked-payment").html((snapshot.val().bitPrice) + " Bitcoins")
                $(".booked-name").html((snapshot.val().firstName) + " " + (snapshot.val().lastName))
                $(".booked-phone").html(snapshot.val().phone)
                $(".booked-email").html(snapshot.val().email)
            //})
        }else if (snapshot.val() === null) { $("#cbookings").html("<h1 style='margin-top: 25px; color:red;'>Your booking do not exist. Check you ID and try again.</h1>")

        }
      });
    }




//check bookings button 
$("#SubmitIdBtn").on("click", function () {
    $("#findBooking").hide()
    $("#cbookings").show()

    var customerInput = $(".idBox").val().trim();

    console.log("TEST", customerInput)

if (customerInput !== ""){
    retrieve(customerInput)
} else {
    alert("please type in you booking ID!")
}
   

});




