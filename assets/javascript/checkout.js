
/************************CHECKOUT PAGE************************************************* */
//Global Variables 
var itemPrices = [0.034,0.00456]; // push in prices of all selected items

var totalPrice = (itemPrices.reduce(getSum)).toFixed(5);
console.log(totalPrice);

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

  $("#step1Button").on("click", function (event){
    event.preventDefault();

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
        phone: phone
    }
    console.log(newCustomer)
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

//ELSE , repeat step 2 with error message 



//WALLET API
 //AUTHENTIFICATION 






