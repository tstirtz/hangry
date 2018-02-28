'use strict'

var MOCK_RESTAURANT_LIST= {
    "restaurants": [
        {
            "name":"restaurant A",
            "address": "address data from google"
        },
        {
            "name": "restaurant B",
            "address": "address data from google"
        },
        {
            "name": "restaurant C",
            "address": "address data from google"
        },
        {
            "name": "restaurant D",
            "address": "address data from google"
        }
    ]
}

function getRestaurantData(callback){
    setTimeOut(function(){callback(MOCK_RESTAURANT_LIST)}, 100;
}

//render restaurant list
function renderRestaurantList(data){
    $('body').append(
        `<p>${data}</p>`
    );
}

function getAndDisplayRestaurants(){
    getRestaurantData(renderRestaurantList);
}

$(getAndDisplayRestaurants);
