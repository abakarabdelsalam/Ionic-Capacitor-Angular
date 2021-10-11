import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PhotoService } from '../photo.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EditModalPage } from '../edit-modal/edit-modal.page';
import { take } from 'rxjs/operators';
import { User } from '../interfaces/user.model';



@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
	ionicForm: FormGroup;
	defaultDate = "1987-06-30";
	// isSubmitted = false;

	allUsers = [];

	sub: Subscription
	isSubmitted: boolean = false;

	constructor(public formBuilder: FormBuilder, private modalController: ModalController, private photoService: PhotoService, private alertController: AlertController) { }

	ngOnInit() {
		this.ionicForm = this.formBuilder.group({
			name: ['', [Validators.required, Validators.minLength(2)]],
			email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
			date: [this.defaultDate]
		});

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


	// getDate(e) {
	// 	let date = new Date(e.target.value).toISOString().substring(0, 10);
	// 	this.ionicForm.get('dob').setValue(date, {
	// 		onlyself: true
	// 	})
	// }

	get errorControl() {
		return this.ionicForm.controls;
	}

	async submitForm() {
		this.isSubmitted = true;
		if (!this.ionicForm.valid) {
			console.log(this.ionicForm)
			return true;
		} else {
			console.log(this.ionicForm.value)
		} const alert = await this.alertController.create({
			header: 'Confirmation??',
			message: '<strong>Cela va ajouter</strong>!!!',
			buttons: [
				{
					text: 'Non',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						this.isSubmitted = false
					}
				}, {
					text: 'Okay',
					handler: () => {

						this.photoService.addUser(this.ionicForm.value)
						this.ionicForm.reset();
						this.photoService.addUser(this.ionicForm.value).then(data => {
							console.log('data', data);

						}).catch(err => {
							console.error(err);

						})
					}
				}
			]
		});

		await alert.present();
	}



	async Editer(id) {
		console.log('id', id);
		const modal = await this.modalController.create({
			component: EditModalPage,
			componentProps: { 'userId': id }
		});
		return await modal.present();
	}

	//Suppression de user
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