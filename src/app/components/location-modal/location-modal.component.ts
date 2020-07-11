import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-location-modal',
    templateUrl: './location-modal.component.html',
    styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('map', {static: true}) mapElementRef: ElementRef;
    clickListener: any;
    googleMap: any;

    constructor(private modalController: ModalController, private renderer2: Renderer2) {
    }

    ngOnInit() {
    }

    onCancel() {
        this.modalController.dismiss(null, 'cancel');
    }

    ngAfterViewInit(): void {
        this.addGoogleMapsSdk().then((googleMaps) => {
            this.googleMap = googleMaps;
            const mapEl = this.mapElementRef.nativeElement;
            // note : adding the map
            const maps = new googleMaps.Map(mapEl, {
                center: {lat: -34.397, lng: 150.644},
                zoom: 16
            });
            // note: listen to the map once loaded
            googleMaps.event.addListenerOnce(maps, 'idle', () => {
                this.renderer2.addClass(mapEl, 'visible');
            });
            // note : add click event
            this.clickListener = maps.addListener('click', event => {
                console.log(event);
                const clickLocation = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                };
                this.modalController.dismiss(clickLocation, 'PickLocation');
            });

        }).catch((error) => {
            console.log('error load the SDK');
        });
    }

    addGoogleMapsSdk(): Promise<any> {
        const win = window as any;
        const googleModule = win.google;
        if (googleModule && googleModule.maps) {
            return Promise.resolve(googleModule.maps);
        }
        return new Promise((resolve, reject) => {
            // note : add map sdk to the dom
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleApiKey}&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
            // note : listen to the script until reload
            script.onload = () => {
                const loadGoogleModule = win.google;
                if (loadGoogleModule && loadGoogleModule.maps) {
                    resolve(loadGoogleModule.maps);
                } else {
                    reject('not able to reload map SDK');
                }
            };
        });
    }

    ngOnDestroy(): void {
        if (this.clickListener) {
            this.googleMap.event.removeListener(this.clickListener);
        }
    }

}
