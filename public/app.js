'use strict'

function login(){
    $('.signin-button-js').on('click', function(event){
        event.preventDefault();
        let username = $(this).prevAll('.username')[0].value;
        let pass = $(this).prevAll('.password')[0].value;

        console.log(username);
        console.log(pass);

        let newUser = {
                  userName: username,
                  password: pass
              }


              $.ajax({
                  url:'/login',
                  method: 'POST',
                  data: JSON.stringify(newUser),
                  dataType: 'json',
                  contentType: 'application/json; charset= utf-8',
                  error: function(object, message){
                      console.log(message);
                      console.log(object);
                  },
                  success: function(data){
                      console.log(data);
                      let id = data.id;
                      let jwt = data.jwt;

                      sessionStorage.setItem('authToken', jwt);
                      sessionStorage.setItem('userId', id);

                      window.location.href = '/dashboard';
                  }
              });
          });
}

function renderSignUpModal(){
    $('.signup-button-js').on('click', function(){
        $('#sign-up-modal').css('display', 'block');
        closeSignUpModal();
    });
}

function confirmPassword(){
    $('#sign-up-modal').on('click', '.create-account-button-js', function(){
        console.log('create-account-button handler working');

        let password = $(this).prevAll('.password-input')[0].value;
        let passwordConfirm = $(this).prevAll('.confirm-password-input')[0].value;
        let username = $(this).prevAll('.username-input')[0].value;

        console.log(username);

        if(password !== passwordConfirm){
            $('.modal-content').append(
                `<p class= "modal-message">Passwords do not match. Please try again.</p>`
            );
        }else if(password === passwordConfirm){
            createNewAccount(username, password);
            closeModal();
            // logInNewUser(username, password);
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
                <button type="button" class = "exit-modal-button">Exit</button>`
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

function closeModal(){
    $('#sign-up-modal').css('display', 'none');
}

// function logInNewUser(username, pass){
//     $('#sign-up-modal').on('click', '.user-dashboard-button', function(){
//
//         let newUser = {
//             userName: username,
//             password: pass
//         }
//
//
//         $.ajax({
//             url:'/login',
//             method: 'POST',
//             data: JSON.stringify(newUser),
//             contentType: 'application/json; charset= utf-8',
//             error: function(object, message){
//                 console.log(message);
//                 console.log(object);
//                 $('.modal-content').append(
//                     `<p class= "modal-message">${message}: Uh oh! Please try again.</p>`
//                 );
//             },
//             success: function(data){
//                 window.location.href = '/dashboard';
//             }
//         });
//     });
// }

function closeSignUpModal(){
    $('#sign-up-modal').on('click', '.close', function(){
        closeModal();
    });


    //Close modal if user clicks outside of modal
    $('#sign-up-modal').on('click', function(event){
        console.log(event.target.id);
        if(event.target.id === 'sign-up-modal'){
            closeModal();
        }
    });
}

$(function(){
    login();
    renderSignUpModal();
    confirmPassword();
});
