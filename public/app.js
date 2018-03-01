'use strict'

// var MOCK_RESTAURANT_LIST= {
//     "restaurants": [
//         {
//             "name":"restaurant A",
//             "address": "address data from google"
//         },
//         {
//             "name": "restaurant B",
//             "address": "address data from google"
//         },
//         {
//             "name": "restaurant C",
//             "address": "address data from google"
//         },
//         {
//             "name": "restaurant D",
//             "address": "address data from google"
//         }
//     ]
// }

var MOCK_USER_LIST= {
    "users": [
        {
            "userName": "user111",
            "password": "1234567890",
            "list": [
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
        },
        {
            "userName": "user112",
            "password": "1234567899",
            "list": [
                {
                    "name":"restaurant E",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant F",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant G",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant H",
                    "address": "address data from google"
                }
            ]
        },
        {
            "userName": "user113",
            "password": "1234567898",
            "list": [
                {
                    "name":"restaurant I",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant J",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant K",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant L",
                    "address": "address data from google"
                }
            ]
        },
        {
            "userName": "user114",
            "password": "1234567897",
            "list": [
                {
                    "name":"restaurant M",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant N",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant O",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant P",
                    "address": "address data from google"
                }
            ]
        },
        {
            "userName": "user115",
            "password": "1234567896",
            "list": [
                {
                    "name":"restaurant Q",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant R",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant S",
                    "address": "address data from google"
                },
                {
                    "name": "restaurant T",
                    "address": "address data from google"
                }
            ]
        }
    ]
};

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
//left off trying to figure out why the test does not recognize the $
//try finding a jQuery middleware for Node.js
