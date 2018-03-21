'use strict'

function renderSignUpModal(){
    $('.signup-button-js').on('click', function(){
    $('#sign-up-modal').css('display', 'block');
    })
}


$(function(){
    renderSignUpModal();
})
