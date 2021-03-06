var $appContainer = $('.app-container'),
    $defaultState = $('[data-template-name="user-input"]').text(),
    $loadedState = $('[data-template-name="display-results"]').text(),
    $weatherOverlay = $('[data-template-name="weather-overlay"]').text();
    $splashState = $('[data-template-name="splash"]').text();

var SplashView = Backbone.View.extend({
  className: 'splash',
  template: _.template($splashState),
  render: function() {
    this.$el.html(this.template({}));
    return this;
  }  
});

var RequestModel = Backbone.Model.extend({
  url: function() {
    return "http://maps.googleapis.com/maps/api/geocode/json?address=" + this.get('zip');
  },
  initialize: function() {
    var me = this;
    this.on('change:zip', function() {
      me.fetch().done(function(data) { 
        me.set('loc', data.results[0].geometry.location);
      });
    });
  }
});

var RequestView = Backbone.View.extend({
  tagName: 'form',
  template: _.template($defaultState),
  events: {
    'submit': 'submit'
  }, 
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  submit: function(e) {
    e.preventDefault();
    var zip = this.$('.zip-code').val();
    this.model.set('zip', zip);
    window.location.hash = 'reps/' + zip;
  },
  render: function() {
    this.$el.html(this.template( {'zip':this.model.get('zip')} ));
    return this;
  }
});

var LegislatorModel = Backbone.Model.extend({});

var LegislatorCollection = Backbone.Collection.extend({
  initialize: function(collection, options) {
    this.reqModel = options.reqModel;
  },
  url: function() { 
    return "https://congress.api.sunlightfoundation.com/legislators/locate?zip=" + this.reqModel.get('zip') + "&apikey=" + window.sunlightAPI;
  },
  parse: function(result) {
    return result.results;
  }
});

var LegislatorView = Backbone.View.extend({
  tagName: 'div',
  className: 'legislator-container',
  template: _.template($loadedState),
  render: function() {
    this.$el.html(this.template({'reps' : this.collection.models}));
  }    
});

var ForecastModel = Backbone.Model.extend({
  initialize: function(collection, options) {
    this.reqModel = options.reqModel;
  },
  url: function() {
    // This uses Nodejitsu's CORS Proxy to make life easier. 
    // http://jsonp.nodejitsu.com/
    return 'http://jsonp.nodejitsu.com/?url=' + 'https://api.forecast.io/forecast/' + window.forecastAPI + '/' + this.reqModel.get('loc')['lat'] + ',' + this.reqModel.get('loc')['lng']; 
  },
  parse: function(forecast) {
    return forecast.currently;
  }
});
//var ForecastCollections = Backbone.Collection.extend({});
var ForecastView = Backbone.View.extend({
  tagName: 'div',
  className: 'weather-overlay',
  template: _.template($weatherOverlay),
  render: function(weather) {
    this.$el.html(this.template(this.model.attributes));
    var icon = this.model.get('icon');
    console.log(icon);
    if (new Date().getHours() >= 19 || new Date().getHours() <= 8) {
      $('.legislator-container').append("<h2>It's a bad time for a call, but why not send someone an email?</h2>");  
    } else if ( ['clear-day', 'partly-cloudy-day'].indexOf(icon) > -1) {
      $('.legislator-container').append("<h2>It's a beautiful day to write a letter to your representatives!</h2>");
    } else if ( ['rain', 'cloudy', 'partly-cloudy-day'].indexOf(icon) > -1) {
      $('.legislator-container').append("<h2>Indoor activities only for now - why not call one of your reps for a chat?</h2>");  
    } 
  }
});

var AppRouter = Backbone.Router.extend({
  initialize: function() {
    this.req = new RequestModel();
    this.requestView = new RequestView({model: this.req});
    this.collLegislators = new LegislatorCollection([], {reqModel: this.req});
    this.viewLegislators = new LegislatorView({collection: this.collLegislators});
    this.forecast = new ForecastModel([], {reqModel: this.req});
    this.viewForecast = new ForecastView({model: this.forecast});  
    this.splashView = new SplashView();
  },
  routes: {
    '':'index',
    'reps/:zip':'rep',
    'test/:zip' : 'test'  
  },
  index: function() {
    this.splashView.render();
    this.requestView.render();
    $appContainer.html(this.splashView.$el);
    $appContainer.find('.form-container').html(this.requestView.$el);
    //$appContainer.html(this.requestView.$el);
  },
  rep: function(zip) {
    var self = this;
    this.req.set('zip', zip);
    this.collLegislators.fetch().done(function(d) {
      self.viewLegislators.render(); 
      $appContainer.html(self.viewLegislators.$el);
      // The Forecast call MUST BE WITHIN A CALLBACK.
      // There is a race condition between the Forecast's
      // .fetch() method and the 'loc' property of the 
      // RequestModel. Sorry for the render delay. :( 
      setTimeout( function () { self.forecast.fetch().done(function() { 
        console.log(self.forecast.get('summary'));
        self.viewForecast.render();
        $appContainer.append(self.viewForecast.$el);
      }, 300);
      });
    });
  },
  test: function(zip) {
    //Dummy route useful for testing new implementations.
  }
});

$(document).ready(function() {
  var myRouter = new AppRouter();
  Backbone.history.start();  
});
