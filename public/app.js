'use strict'

var MOCK_RESTAURANT_LIST= {
    "restaurants": [
        {
            "name":"restaurant A"
        },
        {
            "name": "restaurant B"
        },
        {
            "name": "restaurant C"
        },
        {
            "name": "restaurant D"
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
