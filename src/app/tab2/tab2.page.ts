import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhotoService } from '../photo.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from '../interfaces/user.model';
import { ModalController, AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';

import { EditModalPage } from '../edit-modal/edit-modal.page';
@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

	allUsers = [];

	sub: Subscription
	isSubmitted: boolean = false;


	constructor(private photoService: PhotoService,
		private modalController: ModalController,
		private alertController: AlertController) { }

	ngOnInit() {
		// this.allUsers = this.photoService.allUser;
		this.sub = this.photoService.allUser().subscribe(data => {
			this.allUsers = data.map(e => {
				const userItems = {
					id: e.payload.doc.id,
					...e.payload.doc.data() as User
				};
				console.log('userItems', userItems);
				return userItems;
			})
		}, err => { });
		console.log('ngOnInit', this.allUsers);
	}
	ionViewWillEnter() {
		// this.allUsers = this.photoService.allUser;
		console.log('ionViewwillEnter', this.allUsers);
	}

	// Editer(id) {
	// 	console.log('id', id);
	// }

	async Editer(id) {
		console.log('id', id);
		const modal = await this.modalController.create({
			component: EditModalPage,
			componentProps: { 'userId': id }
		});
		return await modal.present();
	}

	async Supprimer(id) {
		console.log('id', id);
		this.isSubmitted = true;

		const alert = await this.alertController.create({
			header: 'Confirmation?????',
			message: '<strong>Suppression irreversible</ strong > !!!',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						this.isSubmitted = false
					}
				}, {
					text: 'Okay',
					handler: () => {
						this.photoService.supprimerUser(id).pipe(
							take(1)
						).subscribe(data => {
							this.isSubmitted = true;
						}, err => {
							this.isSubmitted = false;
							console.error(err);

						})
					}
				}
			]
		});

		await alert.present();



	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
