var $appContainer = $('.app-container'),
    $defaultState = $('[data-template-name="user-input"]').text(),
    $loadedState = $('[data-template-name="display-results"]').text();

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
  submit: function() {
    var zip = this.$('.zip-code').val();
    this.model.set('zip', zip);
    window.location = '#reps/' + zip;
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


var ForecastModel = Backbone.Model.extend({});
var ForecastCollections = Backbone.Collection.extend({
  url: function() {
    return ;
  }
});

var AppRouter = Backbone.Router.extend({
  initialize: function() {
    this.req = new RequestModel();
    this.requestView = new RequestView({model: this.req});
    this.collLegislators = new LegislatorCollection([], {reqModel: this.req});
    this.viewLegislators = new LegislatorView({collection: this.collLegislators});    
  },
  routes: {
    '':'index',
    'reps/:zip':'rep',
    'test/:zip' : 'test'  
  },
  index: function() {
    this.requestView.render();
    $appContainer.html(this.requestView.$el);
  },
  rep: function(zip) {
    var self = this;
    this.req.set('zip', zip);
    this.collLegislators.fetch().done(function(d) {
      self.viewLegislators.render();
      console.log(self.viewLegislators.collection.models);
      console.log(d);
      $appContainer.html(self.viewLegislators.$el);
    });
  },
  test: function(zip) {
    req.set('zip', zip);
    console.log ('Zip set to ' + zip + '!');
  }
});

$(document).ready(function() {
  var myRouter = new AppRouter();
  Backbone.history.start();  
});
