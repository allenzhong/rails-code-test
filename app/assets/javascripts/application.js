// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .



$(function () {
  if ($.support.localStorage) {

    $(window.applicationCache).bind('error', function () {
      alert('There was an error when loading the cache manifest.');
    });

    if (!localStorage["pendingUrls"]) {
      localStorage["pendingUrls"] = JSON.stringify([]);
    }
    function retrieve(){

      $.retrieveJSON("/urls.json",function(data) {
        var pendingUrls = $.parseJSON(localStorage["pendingUrls"]);
        var formatData = []
        for(var i=0; i< data.length;i++){
          formatData.push({"url":data[i]})
        }
        $("#urls").html($("#url_template").tmpl(formatData.concat(pendingUrls)));
      });
    };
    retrieve();
    $("form").submit(function(e){
      var pendingUrls = $.parseJSON(localStorage["pendingUrls"]);
      var matchedArray = validateUrl($("#url_url").val());
      if(matchedArray){
        var validatedUrl = matchedArray.slice(1,matchedArray.length).join("")
        var url = {"url":{"url":$("#url_url").val(), "short_url":validatedUrl}};
        $("#url_template").tmpl(url).prependTo("#urls");
        pendingUrls.push(url);
        localStorage["pendingUrls"] = JSON.stringify(pendingUrls);
        $("#url_url").val("");
        sendPending();
      }
      e.preventDefault();
    });
    function validateUrl(url){
      var regx = /^(https?:\/\/)?([\da-z\.-]+)(\.[a-z\.]{2,6})[\/\w \.-]*\/?$/;
      var array = regx.exec(url);
      return array;
    }
    function sendPending(){
      if (window.navigator.onLine) {
        var pendingUrls = $.parseJSON(localStorage["pendingUrls"]);
        if (pendingUrls.length > 0) {
          var url = pendingUrls[0];

          $.post("/urls", url, function(data) {
            var pendingUrls = $.parseJSON(localStorage["pendingUrls"]);
            pendingUrls.shift();
            localStorage["pendingUrls"] = JSON.stringify(pendingUrls)
            setTimeout(sendPending, 100);
          });
        }
      }
    }
    sendPending();
    $(window).bind("online", sendPending);
    setInterval(function(){
      retrieve();
      sendPending();
    },15000);
  }else{
    alert("Try a different browser.");
  }
});
