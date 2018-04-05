'use strict'

function login(){
    $('.signin-button-js').on('click', function(event){
        event.preventDefault();
        $('.login-feedback').empty();
        let username = $(this).prevAll('.username')[0].value;
        let pass = $(this).prevAll('.password')[0].value;

        if(username.length === 0 && pass.length === 0){
            $('.login-feedback').append(`<p>Please provide a username and password</p>`);
            return;
        }else if(username.length === 0){
            $('.login-feedback').append(`<p>Please provide a username</p>`);
            return;
        }else if(pass.length === 0){
            $('.login-feedback').append(`<p>Please provide a password</p>`);
            return;
        }

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
                  error: function(object, message, string){
                      console.log(object);
                      if(object.status === 401){
                           $('.login-feedback').append(`<p>Incorrect username or password</p>`);
                      }
                  },
                  success: function(data){
                      console.log(data);
                      let id = data.id;
                      let jwt = data.jwt;

                      sessionStorage.setItem('authToken', jwt);
                      sessionStorage.setItem('userId', id);

                      window.location.href = '/dashboard';
                  },
                  complete: function(object){
                      console.log(object);
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

function checkRequiredFields(){
    $('#sign-up-modal').on('click', '.create-account-button-js', function(){
        $(`.feedback`).empty(``);

        let password = $(this).prevAll('.password-input')[0].value;
        let passwordConfirm = $(this).prevAll('.confirm-password-input')[0].value;
        let username = $(this).prevAll('.username-input')[0].value;

        if(username.length === 0){
            $('.feedback').append(
                `<p class= "modal-message">Please provide a username.</p>`
            );
        }else if(password.length === 0){
            $('.feedback').append(
                `<p class= "modal-message">Please provide a password.</p>`
            );
        }else if(password !== passwordConfirm){
            $('.feedback').append(
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
            console.log(data);
            $('.feedback').append(
                `<p class= "account-created-message">Account created for <em>${data.userName}</em></p>
                `
            );
        },
        error: function(object, message){
            console.log(object);
            $('.feedback').append(
                `<p class= "modal-message">${object.responseJSON.message}: Uh oh! Please try again.</p>`
            );
        },
        complete: function(data){
            console.log(data);
        }
    });
}

function closeModal(){
    $(`.feedback`).empty(``);
    $(`.username-input`).val(``);
    $(`.password-input`).val(``);
    $(`.confirm-password-input`).val(``);
    $('#sign-up-modal').css('display', 'none');
}

//TODO
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
        if(event.target.id === 'sign-up-modal'){
            closeModal();
        }
    });
}

// function refreshOnFirstLoad(){
//             if(!localStorage.getItem('firstLoad')){
//                 localStorage['firstLoad'] = true;
//                 window.location.reload();
//                 console.log("Page reloaded");
//             }else{
//                 localStorage.removeItem('firstLoad');
//             }
// }


$(function(){
    login();
    renderSignUpModal();
    checkRequiredFields();
    // refreshOnFirstLoad()
});
