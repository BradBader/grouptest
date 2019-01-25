var ingredientsArray = [];
var foodCity;
var foodType;

$(document).ready(function () {
  // initializes dropdown
  $('select').formSelect();

  //hides submit buttons, dine in, and pickup options on page load
  $("#restaraunt").hide();
  $("#foodInputs").hide();
  $("#foodInputsSubmit").hide();
  $("#functioningCard").hide();
  $("#using").hide();
  $("#instructions").hide()
  $("#pickUpSubmit").hide()

  //Function that takes the response from the AJAX request and separates it into the necessary elements in order to create a card for each recipe.
  function getRecipes(x) {
    //Clears any previous content where the Recipes will be displayed
    $("#recipeList").empty();
    $("#recipeList2").empty();
    var mealResults = x.hits;
    //Cycles through all the results to separate them into their own cards. 

    for (i = 0; i < mealResults.length; i++) {
      if (i == 0 || i == 5) {
        var rCol = $("<div>").addClass("col s2 offset-s1");
      } else {
        var rCol = $("<div>").addClass("col s2");
      }
      //Adds a link to the Full Recipe on the image of the result
      var rImg = $("<img>").attr("src", mealResults[i].recipe.image);
      var linkUrl = mealResults[i].recipe.url;
      var rLink = $("<a>").attr("href", linkUrl).attr("target", "_blank");
      (rLink).append(rImg);
      var imgDiv = $("<div>").addClass("card-image").append(rLink);
      var rTitle = $("<div>").addClass("card-title center pd10").text(mealResults[i].recipe.label)
      var rIng = mealResults[i].recipe.ingredientLines;
      var rlist = ingredientList(rIng);
      var rCard = $("<div>").addClass("card grey lighten-4 left")

      rCard.append(imgDiv, rTitle, rlist);
      rCol.append(rCard);
      if (i <= 4) {

        $("#recipeList").append(rCol);
      } else {
        $("#recipeList2").append(rCol);
      }
    }
  };
  // sets foodType variable to dropdown menu selection
  $("#submitTer").on("click", function (event) {
    event.preventDefault();

    
    foodType = $("#dropDown").val().trim();
    foodCity = $("#cityName").val().trim();

   var apiKey = "273331ea460eeca63bfcf2af46d9a0c9";
   var cityURL = "https://developers.zomato.com/api/v2.1/cities?q=" + foodCity;
   
    $.ajax({
      url: cityURL,
      beforeSend: function(xhr){xhr.setRequestHeader('user-key', 
      apiKey);},  // This inserts the api key into the HTTP header
      method: "GET"
      
    }).then(function (response) {
      console.log(response);
      getRestaurants(response, foodType);
  
    })
  });


  $("#pickUp").on("click", function () {
    $("#restaraunt").show();
    $("#foodInputs").hide();
    $("#foodInputsSubmit").hide();
    $("#instructions").hide();
    $("#functioningCard").show();
    $("#pickUpSubmit").show()
    $("#recipeList").empty();
    $("#recipeList2").empty();
    $("footer").removeClass("footerStart")
    
  })

    $("#foodD").on("click", function () {
    $("#foodInputs").show();
    $("#restaraunt").hide();
    $("#functioningCard").show();
    $("#using").show();
    $("#foodInputsSubmit").show();
    $("#pickUpSubmit").hide()
    $("footer").removeClass("footerStart")
  })

  //Function that takes the input from the "Ingredients" form and separates them, trims them and returns a variable to be inserted into the Query URL
  function ingSearch(p) {
    var separateIngs = p.split(",");
    var ingURL = "";
    for (var x = 0; x < separateIngs.length; x++) {
      if (x === 0) {
        ingURL = ingURL + "q=" + separateIngs[x];
      } else {
        ingURL = ingURL + "&" + "q=" + separateIngs[x];
      }
    }
    return ingURL;

  }

  //Function that takes the input from the "Excluded" form and separates them, trims them and returns a variable to be inserted into the Query URL
  function exclSearch(q) {
    var separateExcl = q.split(",");
    var exclURL = "";
    for (var x = 0; x < separateExcl.length; x++) {
      if (x === 0) {
        exclURL = separateExcl[x];
      } else {
        exclURL = exclURL + "&" + "excluded=" + separateExcl[x];
      }
    }
    return exclURL;

  }

  //Creates the Ingredients List based on the input for each recipe
  function ingredientList(a) {

    //Creates a div where all the ingredients will go
    var recipeText = $("<div>").addClass("fHeight");

    //Runs through every ingredient in the array in order to separate them into their own line/paragraph
    for (var x = 0; x < a.length; x++) {
      var ingText = $("<p>").text(a[x]);
      $(recipeText).append(ingText);
    }
    return recipeText;
  }
  function getRestaurants(o,p) {
    var cityID = o.location_suggestions[0].id;
    var resURL = "https://developers.zomato.com/api/v2.1/search?entity_id=" + cityID + "&entity_type=city" + "&cuisines=" + p + "&count=9";
    var apiKey = "273331ea460eeca63bfcf2af46d9a0c9";
    $.ajax({
      url: resURL,
      beforeSend: function(xhr){xhr.setRequestHeader('user-key', 
      apiKey);},  // This inserts the api key into the HTTP header
      method: "GET"
      
    }).then(function (response) {
      console.log(response);
      restList(response);
    })

  };

  function restList(k)
  {
     //Clears any previous content where the Recipes will be displayed
     $("#recipeList").empty();
     $("#recipeList2").empty();
     $("#recipeList3").empty();
     var restResults = k.restaurants;
     console.log(restResults);
     //Cycles through all the results to separate them into their own cards. 
 
     for (var i = 0; i < 9; i++) {
      //  if (i == 0) {
      //    var rCol = $("<div>").addClass("col s3 offset-s1");
      //  } else if (i==3 || i == 5) {
      //    var rCol = $("<div>").addClass("col s3 offset-s1");
      //  } else if(i==6 || i==8){
      //   var rCol = $("<div>").addClass("col s3 offset-s1");
      //  }else{
        var rCol = $("<div>").addClass("col s3 offset-s1");
      //  }
       
       var restName = restResults[i].restaurant.name;
       
       var restReview = $("<li>").text("Average User Review: " + restResults[i].restaurant.user_rating.aggregate_rating + "/5");
       var avCost = $("<li>").text("Average Cost for Two: $" + restResults[i].restaurant.average_cost_for_two);
       var restLocation = $("<li>").text("Address: " + restResults[i].restaurant.location.address + "," + restResults[i].restaurant.location.city + "," + restResults[i].restaurant.location.zipcode);
       var infoList = $("<ul>").append(restReview, avCost, restLocation);
       var restImg = restResults[i].restaurant.featured_image;

       var rCard = $("<div>").addClass("card left liHeight");

       if(restImg != ""){
        var rImg = $("<img>").addClass("activator").attr("src", restImg);
       }else{
        var rImg = $("<img>").addClass("activator").attr("src", "food-placeholder.jpg");
       };

       var imgDiv = $("<div>").addClass("card-image waves-effect waves-block waves-light").append(rImg);
       var rTitle = $("<span>").addClass("card-title activator center pd10").text(restName);
       var rContent = $("<div>").addClass("card-content").append(rTitle);
       rTitle.append(infoList);
       var rReveal = $("<div>").addClass("card-reveal").append(rTitle);

       var menuUrl = restResults[i].menu_url;
       var rLink = $("<a>").attr("href", menuUrl).attr("target", "_blank");
    
       rCard.append(imgDiv, rContent, rReveal);
       rCol.append(rCard);
       if (i <= 2) {
 
         $("#recipeList").append(rCol);
       } else if(i<=5) {
         $("#recipeList2").append(rCol);
       }else{
        $("#recipeList3").append(rCol);
       }
     }
   };

  //Creates an event listener that waits for the user to click the "Submit" button in order to begin the recipe search
  $("#submit").on("click", function (event) {

    //Prevents the listener to continue with a blank search
    event.preventDefault();
    $("footer").removeClass("footerStart")
    //shows the instructions
    $("#instructions").show();

    //Runs the Ingredient and Exclution functions in order to make sure the values are inputted correctly
    var ingredient = ingSearch($("#include").val().trim());
    var exclude = exclSearch($("#exclude").val().trim());
    var foodURL = "";

    //Creates a variable with the API Key and ID for the Edamam API
    var key = "app_key=3d809e0fa0e02efd9cc77818c1a35988";
    var id = "app_id=00bc6d9d";

    //Verifies if the "Excluded" field is empty or not. If it is then it just searches for ingredients. If it isn't empty then it adds the "excluded" ingredients to the search
    if (exclude != "") {
      foodURL = "https://api.edamam.com/search?" + id + "&" + key + "&" + ingredient + "&" + "excluded=" + exclude;
      console.log(foodURL);
    } else {
      foodURL = "https://api.edamam.com/search?" + id + "&" + key + "&" + ingredient;
    }

    //Sends the AJAX request to the API with the complete URL
    $.ajax({
      url: foodURL,
      method: "GET"
      //Waits for the response to arrive before calling the getRecipes function in order to display the results
    }).then(function (response) {

      getRecipes(response);

    })

    //Clears the "Include" and "Exclude" forms getting ready for the next search
    $("#include").val("");
    $("#exclude").val("");
  });

})

