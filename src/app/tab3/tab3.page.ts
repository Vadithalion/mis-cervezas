import { Component, OnDestroy, inject } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnDestroy {
  private readonly alert = inject(AlertController);


  public addBeerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    ibus: new FormControl(''),
    degrees: new FormControl(''),
    style: new FormControl(''),
    capacity: new FormControl(''),
    origin: new FormControl(''),
    description: new FormControl('')
  });

  private subscriptions: Subscription[] = [];


  constructor(public photoService: PhotoService) { }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  addBeer () {
    const beerRequest = {
      name: this.addBeerForm.get('name')!.value,
      ibus: this.addBeerForm.get('ibus')?.value || 0,
      degrees: this.addBeerForm.get('degrees')?.value || 0,
      style: this.addBeerForm.get('style')?.value || '',
      capacity: this.addBeerForm.get('capacity')?.value || 0,
      origin: this.addBeerForm.get('origin')?.value || '',
      description: this.addBeerForm.get('description')?.value || ''
    }

    this.subscriptions.push(
      this.photoService.addBeer(beerRequest)
      .pipe(
        catchError(error => {
            this.showDeleteAlert('error')
            throw error;
        })
      )
      .subscribe((response) => {
        this.showDeleteAlert('saved')
      })
    )

    console.log('iñi request' , beerRequest);
  }

  async showDeleteAlert(status: string) {
    if (status === 'saved') {
      const alert = await this.alert.create({
        header: 'Cerveza guardada con éxito',
        buttons: [{text: 'Ok'}]
      });
      await alert.present()
    } else if (status === 'error'){
      const alert = await this.alert.create({
        header: 'Se ha producido un error al guardar',
        buttons: [{text: 'Ok',}
        ]
      });
      await alert.present()
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
