var app = angular.module('myApp', []);
app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = $('meta[name="kurgunAntiKey"]').attr('content');
});