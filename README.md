#API Mashup
###"Grumpy, Guvnah?"

This is a Backbone app designed to demonstrate multiple API's playing nicely together. 

My app pulls weather data & congressional listings to superimpose a fun weather graphic over the names & contact information of the congressional representatives for a given zip code. The purpose? To playfully encourage community participation in the political process. 

My big challenges while developing this app were:
- authentication & secret key management
- shared data between unrelated Backbone views & models
- managing geolocation data 
- SVG creation, optimization and animation


### To Test It Yourself
1. `git clone` this repo and `cd` inside it.
2. `npm install && bower install`.
3. `gulp` to start server.
4. Navigate to `localhost:4000` in your browser.


### Resources & Tools
- [Sunlight Congress API](https://sunlightlabs.github.io/congress/legislators.html)
- [Forecast.io API](http://developer.forecast.io)
- [The Github Of The United States Of America](http://github.com/unitedstates/images)
- [Google's Geocoding API](http://developers.google.com/maps/documentation/geocoding)
- [Affinity Designer](http://affinity.serif.com)
