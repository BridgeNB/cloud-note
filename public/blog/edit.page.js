'use strict';
const HTTP = window.HTTP_MODULE;
const CACHE = window.CACHE_MODULE;
const RENDER = window.RENDER_MODULE;
const HELPER = window.HELPER_MODULE;

let STATE = {};

$(document).ready(onReady);

function onReady() {
    STATE.blogid = HELPER.getQueryStringParam('id');
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    HTTP.getBlogById({
        blogid: STATE.blogid,
        onSuccess: RENDER.renderEditingBlog
    });
    realTimeConvertToMarkdown();
    $('#blog-edit-form').on('submit', onEditSubmit);
}


function realTimeConvertToMarkdown() {
    let converter = new showdown.Converter();
    let pad = $('#content-txt');
    let markdownArea = $('#markdown-target-div');


    let convertTextAreaToMarkdown = function() {
        let html = converter.makeHtml(pad.val());
        markdownArea.html(html);
    };

    pad.on('keyup keydown', convertTextAreaToMarkdown);
}


function onEditSubmit(event) {
    event.preventDefault();
    const newBlog = {
        title: $('#title-txt').val(),
        content: $('#content-txt').val()
    };
    HTTP.updateBlog({
        blogid: STATE.blogid,
        newBlog: newBlog,
        jwtToken: STATE.authUser.jwtToken,
        onSuccess: blog => {
            alert('Blog changes successfully, redirecting ...');
            window.open(`/blog/details.html?id=${STATE.blogid}`, '_self');
        },
        onError: err => {
            alert('There is an error, please try it later');
        }
    })
}