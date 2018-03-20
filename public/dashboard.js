'use strict'

function storeAuthToken(){
    // let authCookie = document.cookie;
    // let authToken = authCookie.slice(4);

    let cookieArray = document.cookie.split(';');
    let id;
    let jwt;

    for(let i=0; i< cookieArray.length; i++){
        if(cookieArray[i].split('=')[0] === 'id'){
            id = cookieArray[i].split('=')[1];
        }
         jwt = cookieArray[i].split('=')[1];
    }
    console.log(id);
    console.log(jwt);


    sessionStorage.setItem('authToken',jwt);
    sessionStorage.setItem('userId', id);
}

function getRestaurantData(callback){
    $('.container').on('click', function(){
        $('.restaurant-list-js').empty();

        console.log("getRestaurantData working");
        console.log(sessionStorage.getItem('authToken'));

        $.ajax({
            url:'/dashboard/restaurants/' + sessionStorage.getItem('userId'),
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset= utf-8',
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);
            },
            success: callback
        });
    })
}

// render restaurant list
function renderRestaurantList(data){
    console.log("This is the restaurant data");
    console.log(data);
    $('.restaurant-list-js').toggleClass('hidden')
      let i = 1;
        data.forEach(function(restaurantObject){
            for(var key in restaurantObject){
                if(key === 'name'){
                    $('.restaurant-list-js').append(
                        `<div class= "restaurant-${i} restaurant-info">
                            <p class= "restaurant-name">${restaurantObject[key]}</p>
                         </div>`
                    );
                }else if(key === 'address'){
                    // $('.restaurant-list-js').append(
                    //     `<p class= "restaurant-address">${restaurantObject[key]}</p>
                    //     <button type="button" class = "edit-button">Edit</button>`
                    // );
                    $(`.restaurant-${i}`).append(`<p class="restaurant-address">${restaurantObject[key]}</p>`);
                    $('.restaurant-list-js').append(`<button type="button" class = "edit-button-js button-${i}">Edit</button>`);
                    i++;
                }
            }
    });
}


function getAndDisplayRestaurants(){
    getRestaurantData(renderRestaurantList);
}

function editRestaurant(){
    $('.restaurant-list-js').on('click', '.edit-button-js', function(){

        let restaurantName = $(this).prev().children('.restaurant-name')[0].innerText;
        let restaurantAddress = $(this).prev().children('.restaurant-address')[0].innerText;

        $('#edit-restaurant-modal').css("display", "block");
        $('.modal-content').children('.edit-restaurant-input.name').attr('placeholder', `${restaurantName}`);
        $('.modal-content').children('.edit-restaurant-input.address').attr('placeholder', `${restaurantAddress}`);

        console.log(restaurantName);

        //
        // $(this).prev().children('.restaurant-name').replaceWith(restaurantNameToEdit);
        // $(this).prev().children('.restaurant-address').replaceWith(restaurantAddressToEdit);
    });
}



function getRandomRestaurant(callback){
    $('.generate-restaurant-js').on('click', function(){
        $.ajax({
            url:'/dashboard/restaurants/random/' + sessionStorage.getItem('userId'),
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset= utf-8',
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);
            },
            success: callback
        });
    });
}

function renderRandomRestaurant(restaurant){
    console.log(restaurant);
    $('.random-restaurant').empty();
    $('.random-restaurant').append(
        `<p>${restaurant.name}</p>
         <p>${restaurant.address}</p>`
    )
}

function getAndDisplayRandomRestaurant(){
    getRandomRestaurant(renderRandomRestaurant);
}

function renderRestaurantAddressInput(){
    $('.add-restaurant-input-js').on('click', function(){
        $(this).attr('placeholder', 'Restaurant Name');
        const addressInput = $(this).next();
        if(addressInput.attr('type') === 'hidden'){
            addressInput.attr('type', 'text');
        }
    });
}

function sendNewRestaurantData(){
    $('.add-restaurant-button-js').on('click', function(event){
        event.preventDefault();
        console.log(event);
        let restaurantName = event.target.form[0].value;
        let address = event.target.form[1].value;


        let restObj = {
            name: restaurantName,
            address: address
        };

        $.ajax({
            url:'/dashboard/restaurants/' + sessionStorage.getItem('userId'),
            method: 'PUT',
            data: JSON.stringify(restObj),
            dataType: 'json',
            contentType: 'application/json; charset= utf-8',
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);
            },
            success: function(response){
                console.log(response);
                // document.getElementsByClassName('add-restaurant').reset();
                $('.add-restaurant :input').val('');
                alert(response.message);
            }
        });
    });
    //Will add callback to append new restaurant to rendered list of restaurants
}




$(function(){
    let promise = new Promise((resolve, reject)=>{
        resolve(storeAuthToken());
    }).then(function(){
        getAndDisplayRestaurants();
        getAndDisplayRandomRestaurant();
        renderRestaurantAddressInput();
        sendNewRestaurantData();
        editRestaurant();
    });
})
