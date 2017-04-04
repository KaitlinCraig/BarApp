import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation } from 'ionic-native';


@Injectable()
export class Locations {

    data: any;

    constructor(public http: Http) {

    }

    load(){


        if(this.data){
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {

          Geolocation.getCurrentPosition().then((position) => {
            this.http.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+ position.coords.latitude+ "," + position.coords.longitude + "&radius=10000&type=night_club&key=AIzaSyBJ1aRMP6ClcWzK3WbGgUWF9q820Y5VB8k")
            .map(res => {
              return res.json().results.map((item) => {
                return item;
              })
            })
            .subscribe(data => {

                this.data = this.applyHaversine(data);
                console.log(this.data);

                this.data.sort((locationA, locationB)=> {

                    if (locationA.name < locationB.name) return -1;
                    if (locationA.name > locationB.name) return 1;
                    return 0;
                    //rating works
                    //name works
                    //distance isnt working because it is blocked by geolocaiton
                });

                resolve(this.data);
            });
        });
      });
    }



    applyHaversine(locations){

      Geolocation.getCurrentPosition().then((position) => {
        let usersLocation = {

          lat: position.coords.latitude,
          lng: position.coords.longitude

        };

        locations.map((location) => {

            let placeLocation = {
                lat: location.geometry.location.lat,
                lng: location.geometry.location.lng
            };

            location.distance = this.getDistanceBetweenPoints(
                usersLocation,
                placeLocation,
                'miles'
            ).toFixed(2);
        });

      });
        return locations;
    }

    getDistanceBetweenPoints(start, end, units){

        let earthRadius = {
            miles: 3958.8,
            km: 6371
        };

        let R = earthRadius[units || 'miles'];
        let lat1 = start.lat;
        let lon1 = start.lng;
        let lat2 = end.lat;
        let lon2 = end.lng;

        let dLat = this.toRad((lat2 - lat1));
        let dLon = this.toRad((lon2 - lon1));
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d;

    }

    toRad(x){
        return x * Math.PI / 180;
    }

}
