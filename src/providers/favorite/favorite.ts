import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Dish } from '../../shared/dish';
import { DishProvider } from '../../providers/dish/dish';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ThrowStmt } from '@angular/compiler';

/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoriteProvider {
  favorites: Array<any>;

  constructor(public http: Http,
    private dishservice: DishProvider ) {
    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];
  }

  addFavorite(id: number): boolean {
    if(!this.isFavorite(id)){
      this.favorites.push(id);
    }
    return true;
  }

  isFavorite(id: number): boolean {
    return this.favorites.some(el => el === id);
  }

  getFavorites(): Observable<Dish[]> {
    return this.dishservice.getDishes()
      .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)));
  }

  deleteFavorite(id: number): Observable<Dish[]> {
    let index = this.favorites.indexOf(id);
    if(index >= 0) {
      this.favorites.splice(index, 1);
      return this.getFavorites();
    } else {
      console.log('Deleting non-existing favorite: ', id)
      return Observable.throw('Deleting non-existing favorite'+ id)
    }
  }


}
