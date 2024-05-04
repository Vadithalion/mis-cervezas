import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { Subscription, catchError, switchMap } from 'rxjs';
import { Beer } from 'src/app/models/api-photo.model';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class CardComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly photoservice = inject(PhotoService);
  private readonly alert = inject(AlertController);

  public beer?: Beer;

  private beerId?: string
  private subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this.beerId = this.route.snapshot.params['id'];

    if (this.beerId) {
      this.subscriptions.push(
        this.photoservice.getBeerById(this.beerId)
        .pipe(
          catchError(error => {
            if (error.status === 404) {
              console.error('Beer with ID', this.beerId, 'not found');
              this.router.navigate(['/tabs/tab2']);
              return [];
            } else {
              // Handle other errors (e.g., network errors)
              console.error('An error occurred:', error);
              throw error;
            }
          })
        )
        .subscribe((response) => {
          this.beer = response;
        })
      )
    }
  }

  async showDeleteAlert(deleted?: string) {
    if (deleted === 'deleted') {
      const alert = await this.alert.create({
        header: 'Cerveza elminada con exito',
        buttons: [{text: 'OK'}]
      });
      await alert.present()
    } else {

      const alert = await this.alert.create({
        header: 'Esta acción elminará permanentemente esta cerveza de la galeria',
        message: '¿Esta seguro?',
        buttons: [
          {
            text: 'Confirmar',
            handler: () => this.deleteBeer()
          },
          {
            text: 'Cancelar',
          }
        ]
      });
      await alert.present()
    }
  }


  deleteBeer() {
    if (this.beerId) {
      this.subscriptions.push(
        this.photoservice.deleteBeerById(this.beerId).subscribe( (response) => {
          if (response) {
            this.showDeleteAlert('deleted');
            this.router.navigate(['/tabs/tab2']);
          }
        })
      )
    }
  }

  public goBack(): void {
    this.router.navigateByUrl('/tabs/tab2');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
