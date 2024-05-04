import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Subscription } from 'rxjs';
import { Beer } from '../models/api-photo.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy{

  public beerList: Beer[] = [];
  public filteredBeerList: Beer[] = [];

  private subscriptions: Subscription[] = [];

  constructor(public photoService: PhotoService) { }

  async ngOnInit() {
    // await this.photoService.loadSaved();
    this.getBeerList();
  }

  getBeerList() {
    this.subscriptions.push(
      this.photoService.getBeerList().subscribe(response => {
        this.beerList = response;
        this.filteredBeerList = this.beerList.slice(); // Create a copy for filtering
      })
    );
  }

  searchBeer(searchTerm: any) {
    this.filteredBeerList = this.beerList.filter(beer => {
      const searchText = searchTerm.target.value.toLowerCase();
      // Search by beer name (modify based on your Beer model properties)
      return beer.name.toLowerCase().includes(searchText);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
