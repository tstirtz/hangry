'use strict'

function renderSignUpModal(){
    $('.signup-button-js').on('click', function(){
        $('#sign-up-modal').css('display', 'block');
    });
}

function confirmPassword(){
    $('#sign-up-modal').on('click', '.create-account-button-js', function(){
        console.log('create-account-button handler working');

        let password = $(this).prevAll('.password-input')[0].value;
        let passwordConfirm = $(this).prevAll('.confirm-password-input')[0].value;
        let username = $(this).prevAll('.username-input')[0].value;

        console.log(password);
        console.log(passwordConfirm);
        console.log(username);

        if(password !== passwordConfirm){
            $('.modal-content').append(
                `<p class= "modal-message">Passwords do not match. Please try again.</p>`
            );
        }else if(password === passwordConfirm){
            createNewAccount(username, password);
        }
    });
}

function createNewAccount(username, pass){



    let newUser = {
        userName: username,
        password: pass
    }

    $.ajax({
        url:'/user-account',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(newUser),
        contentType: 'application/json; charset= utf-8',
        success: function(data){
            $('.modal-content').append(
                `<p class= "account-created-message">Account created for <em>${data.userName}</em></p>
                <button type="button">User Dashboard</button>`
            );
        },
        error: function(object, message){
            console.log(message);
            console.log(object);
            $('.modal-content').append(
                `<p class= "modal-message">${object.responseJSON.message}: Uh oh! Please try again.</p>`
            );
        }
    });
}

$(function(){
    renderSignUpModal();
    confirmPassword();
});
