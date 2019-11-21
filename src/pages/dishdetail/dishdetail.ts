import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../../pages/comment/comment';
/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private favoriteservice: FavoriteProvider,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    @Inject('BaseURL') private BaseURL) {
      //navparameter which was pushed in by menu component will be retrieved by dishdetail page(line 39 menu.ts)
      this.dish = navParams.get('dish');
      this.numcomments = this.dish.comments.length;

      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating);
      this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + " added as a favorite succesfully",
      position: 'middle',
      duration: 3000
    }).present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add To Favorites',
          handler: () => {
            this.addToFavorites();
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            console.log('Add Comment clicked');
            this.openCommentModal();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  openCommentModal() {
    let modal = this.modalCtrl.create(CommentPage);
    //onDidDismiss receiving data from dismiss() function of Comment Page
    modal.onDidDismiss(comment => {
      //{author: "sadasdasd",comment: "asdasdasd",date: "2019-11-21T21:06:01.010Z",rating: 5}
      console.log('Comment from dishdetail', comment);
      if(comment) {
        this.dish.comments.push(comment);
      }
    });
    modal.present();

  }
}
