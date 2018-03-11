'use strict'

function getRestaurantData(callback){
    $('.container').on('click', function(){
        console.log("getRestaurantData working");
        $.getJSON(`/dashboard/restaurants`, callback);
    })
}

//render restaurant list
function renderRestaurantList(data){
    console.log(data[1].restaurants);
    let restaurantsArray = data[1].restaurants;
        restaurantsArray.forEach(function(restaurantObject){
            for(var key in restaurantObject){
                if(key === 'name'){
                    $('.restaurant-list').append(
                        `<p>${restaurantObject[key]}</p>`
                    );
                }else if(key === 'address'){
                    $('.restaurant-list').append(
                        `<p>${restaurantObject[key]}</p>`
                    );
                }
            }
    });
}

function getAndDisplayRestaurants(){
    getRestaurantData(renderRestaurantList);
}


$(function(){
    getAndDisplayRestaurants();
})
