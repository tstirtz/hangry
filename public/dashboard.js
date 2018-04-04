'use strict'

function getRestaurantData(callback){
    $('.container').on('click', function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        if(!($('.add-restaurant').hasClass('hide'))){
            $('.add-restaurant').toggleClass('hide', true);
        }

        $('.restaurant-list-js').empty();
        hideRandomRestaurant();

        if($('.restaurant-list-js').hasClass('hide')){
            smallDeviceMediaQuery();
            tabletMediaQuery(); //slide image and generate restaurant button to the right
        //if restaurant list isn't hidden then make request to get list of restaurants
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
        }else if(!($('.restaurant-list-js').hasClass('hide'))){
            smallDeviceMediaQuery();
            tabletMediaQuery(); //slide image and generate restaurant button to the right
            $('.restaurant-list-js').toggleClass('hide');
        }
    })
}

// render restaurant list
function renderRestaurantList(data){
    console.log("This is the restaurant data");
    console.log(data);
    $('.restaurant-list-js').toggleClass('hide');
      let i = 1;
        data.forEach(function(restaurantObject){
            let restaurantId = restaurantObject._id;
            for(var key in restaurantObject){
                if(key === 'name'){
                    $('.restaurant-list-js').append(
                        `<div class = "restaurant-and-buttons-${i} restaurant-and-buttons">
                            <div class= "restaurant-${i} restaurant-info ${restaurantId}">
                                <p class= "restaurant-name">${restaurantObject[key]}</p>
                             </div>
                         </div>`
                    );
                }else if(key === 'address'){
                    $(`.restaurant-${i}`).append(`<p class="restaurant-address">${restaurantObject[key]}</p>`);
                    $(`.restaurant-and-buttons-${i}`).append(
                        `<div class= "edit-delete-buttons">
                            <i class="far fa-edit button edit-button-js button-${i}"></i>
                            <i class="fas fa-trash-alt button delete-button-js-${restaurantId}" id= "${restaurantId}"></i>
                         </div>`);
                    renderDeleteModal(restaurantId);
                    renderEditModal(i);
                    i++;
                }
            }
    });
}


function getAndDisplayRestaurants(){
    getRestaurantData(renderRestaurantList);
}

function renderEditModal(buttonNumber){
    $('.restaurant-list-js').on('click', `.button-${buttonNumber}`, function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        $('#edit-restaurant-modal').css("display", "block");

        let restaurantName = $(this).parent().prev().children('.restaurant-name')[0].innerText;
        let restaurantAddress = $(this).parent().prev().children('.restaurant-address')[0].innerText;
        let restaurantId = $(this).parent().prev()[0].classList[2];

        $('.modal-form').children('.edit-restaurant-input.name').attr('placeholder', `${restaurantName}`);
        $('.modal-form').children('.edit-restaurant-input.address').attr('placeholder', `${restaurantAddress}`);
        $('.modal-form').children('.submit-edit').attr('value', restaurantId);

        $('.restaurant-list-js').off(`.button-${buttonNumber}`);

        editRestaurant();
        closeEditModal();
    });
}

function editRestaurant(){
    $('#edit-restaurant-modal').on('click','.submit-edit', function(event){
        event.stopImmediatePropagation();

        let idToEdit = $(this)[0].attributes[2].nodeValue;

        $('.modal-message').empty();
            let updatedName = $(this).prevAll()[2].value;
            let updatedAddress = $(this).prevAll()[0].value;

            if(updatedName.length === 0){
                return $('.modal-message').append(`<p>Please provide a restaurant name.</p>`);
            }else if(updatedAddress.length === 0){
                return $('.modal-message').append(`<p>Please provide an address.</p>`);
            }else {

                let updatedRestaurantInfo = {
                    name: updatedName,
                    address: updatedAddress
                }

                $.ajax({
                    url:'/dashboard/restaurants/edit/' + sessionStorage.getItem('userId') + '.' + idToEdit,
                    method: 'PUT',
                    data: JSON.stringify(updatedRestaurantInfo),
                    dataType: 'json',
                    contentType: 'application/json; charset= utf-8',
                    beforeSend: function(xhr){
                        xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);
                    },
                    success: function(){
                        alert("Restaurant updated");
                    },
                    error: function(jqXHR, errorValue){
                        alert(errorValue);
                        console.log(errorValue);
                    },
                    sussess: [hideEditModal(), hideRestaurantList(), clearEditModal()]
                });
            }
    });
}

function hideEditModal(){
    $('#edit-restaurant-modal').css("display", "none");
    smallDeviceMediaQuery();
    tabletMediaQuery();
}

function hideRestaurantList(){
    $('.restaurant-list-js').toggleClass('hide');
}

function clearEditModal(){
    $('.modal-form').children('.edit-restaurant-input.name').removeAttr('placeholder');
    $('.modal-form').children('.edit-restaurant-input.address').removeAttr('placeholder');
    $('.modal-form').children('.edit-restaurant-input.name').val('');
    $('.modal-form').children('.edit-restaurant-input.address').val('');
    $('.modal-form').children('.submit-edit').removeAttr('value');
}



function getRandomRestaurant(callback){
    $('.generate-restaurant-js').on('click', function(event){
        event.stopImmediatePropagation();

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
    if($('.random-restaurant').hasClass('hide')){
        $('.random-restaurant').toggleClass('hide');
    }
    $('.random-restaurant').empty();
    $('.random-restaurant').append(
        `<p>${restaurant.name}</p>
         <p>${restaurant.address}</p>`
    )
}

function getAndDisplayRandomRestaurant(){
    getRandomRestaurant(renderRandomRestaurant);
}

function hideRandomRestaurant(){
    $('.random-restaurant').empty();
    if(!($('.random-restaurant').hasClass('hide'))){
        $('.random-restaurant').toggleClass('hide');
    }
}

function renderAddRestaurantInputs(){
    $('.add-restaurant-button-js').on('click', function(event){
        event.stopPropagation();
        event.preventDefault();
        hideRandomRestaurant();
        toggleAddRestaurantInputs();
    });
}

function toggleAddRestaurantInputs(){
    $('.add-restaurant :input').val('');
    $('.add-restaurant').toggleClass('hide');
}

function sendNewRestaurantData(){
    $('.add-restaurant').on('click', '.submit-add-restaurant-js', function(event){
        event.stopImmediatePropagation();
        event.preventDefault();

        let restaurantName = $('.add-restaurant-name').val();
        let address = $('.add-address-input').val();

        if(restaurantName.length === 0){
            $('.add-restaurant').append(`<p aria-live= "assertive">Restaurant name required</p>`);
            return;
        }


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
                toggleAddRestaurantInputs();
                alert(response.message);
            },
            error: function(){
                alert(response.error);
            }
        });
    });
}

function renderDeleteModal(idToDelete){
    $('main').on('click', `.delete-button-js-${idToDelete}`, function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        $('#delete-restaurant-modal').css("display", "block");
        let restaurantToDelete = $(this)[0].id;

        closeDeleteModal();
        deleteRestaurant(restaurantToDelete);
        $('main').off(`.delete-button-js-${idToDelete}`);
    });
}

function deleteRestaurant(restIdToDelete){
    $('body').off('click', '.yes-button-js');
    $('body').on('click', '.yes-button-js', function(){
        event.stopImmediatePropagation();

        $.ajax({
            url:'/dashboard/restaurants/delete/' + sessionStorage.getItem('userId') + '.' + restIdToDelete,
            method: 'DELETE',
            dataType: 'json',
            contentType: 'application/json; charset= utf-8',
            statusCode: {
                204: function(){
                    //TODO
                    // $('#delete-restaurant-modal .modal-content').append(
                    //     `<p>Restaurant deleted.</p>`
                    // );
                }
            },
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);
            },
            error: function(jqXHR, errorValue){
                console.log(jqXHR);
                $('#delete-restaurant-modal .modal-content').append(
                    `<p>${errorValue}</p>`
                );
            },
            success: [hideDeleteModal(), hideRestaurantList()]
        });
    });

    $('#delete-restaurant-modal').on('click', '.no-button-js', function(){
        event.stopImmediatePropagation();
        $('#delete-restaurant-modal').css("display", "none");
    });
    //prevents event propagation on susequent delete modal yes/no button clicks
    $('main').off('click', '.yes-button-js');
}

function hideDeleteModal(){
    $('#delete-restaurant-modal').css("display", "none");
    smallDeviceMediaQuery();
    tabletMediaQuery();
}

function closeEditModal(){
    $('#edit-restaurant-modal').on('click', '.close', function(){
        hideEditModal();
    });


    //Close modal if user clicks outside of modal
    $('#edit-restaurant-modal').on('click', function(event){
        if(event.target.id === 'edit-restaurant-modal'){
            hideEditModal();
        }
    });
}

function closeDeleteModal(){
    $('#delete-restaurant-modal').on('click', '.close', function(){
        hideDeleteModal();
    });


    //Close modal if user clicks outside of modal
    $('#delete-restaurant-modal').on('click', function(event){
        if(event.target.id === 'delete-restaurant-modal'){
            hideDeleteModal();
        }
    });
}

function smallDeviceMediaQuery(){
    const screenSize = window.matchMedia('(max-width: 610px)');
    if(screenSize.matches){
        $('.generate-restaurant').toggleClass('hide');
    }
}

function tabletMediaQuery(){
    const screenSize = window.matchMedia('(min-width: 611px)');
    if(screenSize.matches){
        $('.generate-restaurant').toggleClass('tablet');
        $('img').toggleClass('tablet');
    }
}

function smallDeviceMediaQuery(){
    const smallScreenSize = window.matchMedia('(max-width: 400px)');
    const mediumScreenSize = window.matchMedia('(min-width: 400px)');
    $(window).on('resize', function(){
        if(mediumScreenSize.matches){
            $('.add-restaurant-button-js').text('Add Restaurant');
        }else if(smallScreenSize.matches){
            $('.add-restaurant-button-js').text('+');
        }
    });

    if(smallScreenSize.matches){
        $('.add-restaurant-button-js').text('+');
    }
}

function getStartedUserInstructions(){
    $('.get-started').on('click', function(){
        const addRestInstructions = () => $('.instructions-add-restaurant').toggleClass('show');   //this toggles visibility of element
        const generateRestInstructions = () => $('.instructions-generate-restaurant').toggleClass('show');
        const restListInstructions = () => $('.instructions-restaurant-list').toggleClass('show');

        //fade in instruction pop-ups one by one
        addRestInstructions();
        setTimeout(generateRestInstructions, 5000);
        setTimeout(restListInstructions, 10000);

        setTimeout(addRestInstructions, 5000);
        setTimeout(generateRestInstructions, 10000);
        setTimeout(restListInstructions, 15000);
    });
}



$(function(){
    getAndDisplayRestaurants();
    getAndDisplayRandomRestaurant();
    renderAddRestaurantInputs();
    sendNewRestaurantData();
    smallDeviceMediaQuery();
    getStartedUserInstructions();
});
