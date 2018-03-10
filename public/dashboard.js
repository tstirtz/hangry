'use strict'

function getRestaurantData(callback){
    console.log("getRestaurantData working");
    setTimeout(function(){callback(MOCK_USER_LIST)}, 100);
}

//render restaurant list
function renderRestaurantList(data){
    for (var index in data.users){
        $('body').append(
            `<p>${data.users[index].userName}</p>`
        );
    }
}

function getAndDisplayRestaurants(){
    getRestaurantData(renderRestaurantList);
}


$(function(){
    getAndDisplayRestaurants();
})
