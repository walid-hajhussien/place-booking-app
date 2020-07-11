import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {PlacesService} from '../../services/places/places.service';
import {PlaceModel} from '../../models/placeModel/place.model';
import {LoadingController, NavController} from '@ionic/angular';
import {delay, take} from 'rxjs/operators';
import {LocationInterface} from '../../interfaces/location.interface';

@Component({
    selector: 'app-new-offer',
    templateUrl: './new-offer.page.html',
    styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
    offerForm: FormGroup;

    constructor(private authService: AuthService, private placesService: PlacesService, private navController: NavController, private loadingController: LoadingController) {
    }

    ngOnInit() {
        this.offerForm = new FormGroup({
            title: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            description: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
            }),
            price: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.min(1)]
            }),
            dateFrom: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            dateTo: new FormControl(null, {
                updateOn: 'blur',
                validators: [Validators.required]
            }),
            location: new FormControl(null, {
                validators: [Validators.required]
            })
        });
    }

    onCreateOffer() {
        const place = new PlaceModel(this.offerForm.value.title,
            this.offerForm.value.description,
            'data:image/jpeg;base64,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',
            +this.offerForm.value.price, new Date(this.offerForm.value.dateFrom),
            new Date(this.offerForm.value.dateTo), this.authService.userId, this.offerForm.value.location);
        console.log('offer created....', place);
        // note: start loading
        this.loadingController.create({message: 'Creating Place..'}).then((loadingEl) => {
            loadingEl.present();
            this.placesService.addPlace(place).pipe(take(1), delay(1000)).subscribe((saved) => {
                loadingEl.dismiss();
                this.offerForm.reset();
                this.navController.navigateBack(['/', 'places', 'offers']);
            });
        });
    }

    onClearForm() {
        this.offerForm.reset();
    }

    onLocationPick(placeLocation: LocationInterface) {
        console.log(placeLocation);
        this.offerForm.patchValue({location: placeLocation});
        console.log(this.offerForm);
    }

}
