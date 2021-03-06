'use strict';
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;

$(document).ready(onPageLoad);

function onPageLoad() {
    $('#sign-up-form').submit(onSignUpSubmit);
    $('#login-form').submit(onLoginSubmit);
}

function onSignUpSubmit(event) {
    event.preventDefault();
    const userData = {
        name:     $('#name-txt').val(),
        email:    $('#email-txt').val(),
        username: $('#username-txt').val(),
        password: $('#password-txt').val()
    };
    HTTP.signupUser({
        userData,
        onSuccess: user => {
            alert(`User "${user.name}" created, you may log in.`);
            window.open('/auth/login.html', '_self');
        },
        onError: err => {
            alert(`There was a problem processing your request, please try it later.`);
        }
    });
}

function onLoginSubmit(event) {
    event.preventDefault();
    const userData = {
        username: $('#username-txt').val(),
        password: $('#password-txt').val()
    };
    HTTP.loginUser({
        userData,
        onSuccess: response => {
            const authenticatedUser = response.user;
            authenticatedUser.jwtToken = response.jwtToken;
            CACHE.saveAuthenticatedUserIntoCache(authenticatedUser);
            alert('Login successful, redirecting you to homepage...');
            window.open('/', '_self');
        },
        onError: err => {
            alert('Incorrect username or password. Please try it again!');
        }
    });
}
