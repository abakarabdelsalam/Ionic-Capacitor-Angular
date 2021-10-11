import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PhotoService } from '../photo.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from '../interfaces/user.model';

@Component({
	selector: 'app-edit-modal',
	templateUrl: './edit-modal.page.html',
	styleUrls: ['./edit-modal.page.scss'],
})
export class EditModalPage implements OnInit, OnDestroy {
	// item;
	@Input() userId: string;
	userItem: any;
	sub: Subscription;
	form: FormGroup;

	constructor(
		private photoService: PhotoService,
		private modalController: ModalController,
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private toastController: ToastController
	) { }

	ngOnInit() {

		this.sub = this.photoService.getUser(this.userId).subscribe(data => {
			this.userItem = {
				id: data.payload.id,
				...data.payload.data() as User
			};
			this.createForm();
			console.log('this.userItem', this.userItem);

		}, err => {
			console.error(err)
		});
	}

	createForm() {
		this.form = this.fb.group({
			name: new FormControl(this.userItem.name),
			date: new FormControl(this.userItem.date),
			email: new FormControl(this.userItem.email)
		})
	}

	update() {
		console.log(this.form.value);
		const updatedUser = { ...this.form.value, id: this.userItem.id };
		this.photoService.updateUser(updatedUser).subscribe(async () => {
			const toast = await this.toastController.create({
				message: 'Modification OK.',
				duration: 2000,
				position: 'middle'
			});
			toast.present();
		})
	}

	goBack() {
		this.modalController.dismiss();
	}
	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

}
