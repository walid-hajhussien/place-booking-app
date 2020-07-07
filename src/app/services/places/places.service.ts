import {Injectable} from '@angular/core';
import {PlaceModel} from '../../models/placeModel/place.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private placesChangeBehavior: BehaviorSubject<PlaceModel[]>;
    private _places: PlaceModel[];

    constructor(private httpClient: HttpClient) {
        this.fetchPlaces().subscribe((r) => {

        })
        this._places = [
            new PlaceModel('Zarqa', 'Big city at Jordan!',
                'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Qurtobah%2C_Az-Zarqa%2C_Jordan_-_panoramio_%283%29.jpg/1200px-Qurtobah%2C_Az-Zarqa%2C_Jordan_-_panoramio_%283%29.jpg',
                100, new Date('2020-01-01'), new Date('2020-12-31'), 'u1', 'j1'),
            new PlaceModel('Amman', 'The capital of jordan!',
                'https://lp-cms-production.imgix.net/2019-06/4325bdf24da8cb3d129a26d3a77ecba2-amman.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4',
                200, new Date('2020-01-01'), new Date('2021-12-31'), 'u2', 'j2'),
            new PlaceModel('Aqaba', 'famous place in jordan!',
                'data:image/jpeg;base64,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',
                300, new Date('2019-01-01'), new Date('2019-12-31'), 'u3', 'j3')
        ];
        this.placesChangeBehavior = new BehaviorSubject<PlaceModel[]>([...this._places]);
    }

    get places(): PlaceModel[] {
        return [...this._places];
    }

    set places(places: PlaceModel[]) {
        this._places = places;
    }

    get changePlacesEvent() {
        return this.placesChangeBehavior.asObservable();
    }

    getPlaceById(id: string): PlaceModel {
        return this._places.find(value => {
            return value.id === id;
        });
    }

    addPlace(place: PlaceModel): Observable<{ name: string }> {
        // note : the Id will be add from firebase
        return this.httpClient.post<{ name: string }>(environment.firebasePlaces, place)
            .pipe(tap((response) => {
                place.id = response.name;
                this._places.push(place);
                this.placesChangeBehavior.next([...this._places]);
                console.log('firbase', response);
            }));
    }

    updatePlace(newPlace: PlaceModel): Observable<boolean> {
        return new Observable((observe) => {
            this._places = this._places.map((place) => {
                return (newPlace.id === place.id) ? newPlace : place;
            });
            this.placesChangeBehavior.next([...this._places]);
            observe.next(true);
        });
    }

    fetchPlaces(): Observable<PlaceModel[]> {
        return this.httpClient.get<FbPlacesInterface>(environment.firebasePlaces).pipe(map((response) => {
            if (!response) {
                this._places = [];
                this.placesChangeBehavior.next(this._places);
                return  this._places;
            }
            const fetchPlaces: PlaceModel[] = [];
            for (const k of Object.keys(response)) {
                const fbPlace = response[k];
                const place = new PlaceModel(
                    fbPlace.title,
                    fbPlace.description,
                    fbPlace.imageUrl,
                    fbPlace.price,
                    fbPlace.availableFrom,
                    fbPlace.availableTo,
                    fbPlace.userId,
                    k
                );
                fetchPlaces.push(place);
            }
            this._places = fetchPlaces;
            this.placesChangeBehavior.next(this._places);
            return fetchPlaces;
        }));
    }
}
