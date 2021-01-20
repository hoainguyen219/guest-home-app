import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Hostel } from 'src/app/shared/interfaces/hostel';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-search-by-map',
  templateUrl: './search-by-map.component.html',
  styles: [
  ]
})
export class SearchByMapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() hostels: Hostel[];
  @Input() lat: number;
  @Input() lng: number;
  @Input() radius: number;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @Output() onMapClick: EventEmitter<any> = new EventEmitter<any>();

  public markTitle: string;
  public markAddress: any;

  public apiLoaded$;
  public options: google.maps.MapOptions = {
    zoom: 14,
    draggable: true
  };

  public circleOptions: google.maps.CircleOptions = {
    strokeColor: 'red',
    strokeWeight: 2
  };

  public center: google.maps.LatLngLiteral;
  public radiusSize: number;

  public markers: google.maps.Marker[] = [];
  public markerOptions: google.maps.MarkerOptions = { draggable: false };
  public map: google.maps.Map;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    // this.getLocation();
  }

  mapInit(): void {
    this.apiLoaded$ = this.httpClient.jsonp(`https://maps.googleapis.com/maps/api/js?key=${environment.apiKey}`, 'callback')
      .pipe(
        map(() => true),
        catchError((err) => { console.log(err); return of(false); }),
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hostels && changes.hostels.currentValue) {
      this.getMarker();
    }

    if (changes?.lat?.currentValue && changes?.lng?.currentValue) {
      this.center = {
        lat: changes.lat.currentValue,
        lng: changes.lng.currentValue
      };
    }

    if (changes?.radius?.currentValue) {
      this.radiusSize = changes.radius.currentValue;
    }
  }


  ngAfterViewInit(): void {
    this.getLocation();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      const options = { timeout: 5000 };
      navigator.geolocation.getCurrentPosition(
        location => {
          console.log('địa chỉ hiện tại:', location.coords);
          this.center = {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          };
          this.mapInit();
        },
        err => {
          console.log(err);
          this.center = {
            lat: 21,
            lng: 106
          };
          this.mapInit();
        }, options);
    } else {
      alert('Sorry, browser does not support geolocation!');
    }
  }

  getMarker(): void {
    this.markers = [];
    this.hostels.forEach(
      (hostel: any) => {

        if (hostel.lat && hostel.lng) {

          const marker = new google.maps.Marker({
            title: hostel.title, // tiêu đề
            label: hostel.address, // thông tin giá trị địa chỉ.
            zIndex: hostel.postId, // truyền vào id của marker.
            position: new google.maps.LatLng({lat: hostel.lat, lng: hostel.lng})
          });
          this.markers.push(marker);
        }
      }
    );
  }

  toDetailHostel(id): void {
    window.open(`http://localhost:4200/hostel/detail/${id}`, '_blank');
  }

  async searchByClick(location: google.maps.MouseEvent): Promise<any> {
    const params = {
      lat: location.latLng.lat(),
      lng: location.latLng.lng(),
      address: '',
    };
    const result: any = await this.httpClient
    .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${params.lat},${params.lng}&key=${environment.apiKey}`)
    .toPromise();
    if (result) {
      params.address = result.results[0].formatted_address;
      this.onMapClick.emit(params);
    }
  }

  closeInfoWindow(event): void {
    this.infoWindow.close();
  }

  openInfoWindow(marker: MapMarker, title, address): void {
    console.log(title, address);
    this.markTitle = title;
    this.markAddress = address;
    this.infoWindow.open(marker);
  }
}
