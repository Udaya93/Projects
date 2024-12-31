  /* let mapToken=mapToken;
  console.log(mapToken); */
	mapboxgl.accessToken = mapToken
       
  const map = new mapboxgl.Map({
        container: 'map', // container ID
        //choose from Mapbox's core styles or make own style
       // style:"mapbox://styles/mapbox/streets-v12",//style URL
        center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

  console.log(`Final Coordinates: ${coordinates}`);

    // Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: 'red' })
.setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
.setPopup(
    new mapboxgl.Popup({ offset: 25 }) // Create a Popup
        .setHTML(`<h1>${listing.title}</h1><p>Exact Location will be provided after booking`) // Set the HTML content for the Popup
)
.addTo(map); // Add the marker to the map

//if we want we can add multiple markers but differnt cordinates otherwise they will overlap
map.on('load', () => {
  // Load an image from an external URL or relative path
  map.loadImage(
      'images/airbnb.png', // Replace with a valid URL or relative path
      (error, image) => {
          if (error) {
              console.error("Image loading error:", error);
              return;
          }

          // Add the image to the map style
          map.addImage('cat', image);

          // Add a data source containing one point feature
          map.addSource('point', {
              'type': 'geojson',
              'data': {
                  'type': 'FeatureCollection',
                  'features': [
                      {
                          'type': 'Feature',
                          'geometry': {
                              'type': 'Point',
                              'coordinates': listing.geometry.coordinates // Ensure this is valid
                          }
                      }
                  ]
              }
          });

          // Add a layer to display the image as a symbol
          map.addLayer({
              id: 'points',
              type: 'symbol',
              source: 'point',
              layout: {
                  'icon-image': 'cat',
                  'icon-size': 0.5 // Adjust size as needed
              }
          });
      }
  );
});
