var $appContainer = $('.app-container'),
    $defaultState = $('[data-template-name="user-input"]').text(),
    $loadedState = $('[data-template-name="display-results"]').text();

var appRoutes = Backbone.Router.extend({
  routes: {
    '':'index',
    'rep/:zip':'rep'  
  },
  index: function() {
    $appContainer.html(_.template($defaultState)({'zip':'29108'}));
  },
  rep: function(zip) {
    $appContainer.html(_.template($loadedState)({'rep': {'name':'James', 'zipcode':'29108' }}));
  }
});

$(document).ready(function() {
var myRouter = new appRoutes();
Backbone.history.start();  
});
