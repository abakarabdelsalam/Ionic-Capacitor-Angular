import { Plugins, CameraResultType } from '@capacitor/core';
import { User } from './interfaces/user.model';
import { AngularFirestore, DocumentReference, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { take } from 'rxjs/operators';


const { Camera } = Plugins;

@Injectable({
	providedIn: 'root',
})
export class PhotoService {
	// public _suerService: User[] = [];

	// get allUser() {
	// 	return this._suerService;
	// }


	public items: Item[] = [];

	public photos: Photo[] = [];

	constructor(private afs: AngularFirestore) {
	}

	allUser() {
		return this.afs.collection('userss').snapshotChanges();
	}
	//pour le modal
	getUser(id: string): Observable<Action<DocumentSnapshot<{}>>> {
		return this.afs.collection('userss').doc(id).snapshotChanges();
	}

	addUser(userItem: User): Promise<DocumentReference> {
		// this._suerService = [userItem, ...this._suerService];
		// console.log(this._suerService);
		return this.afs.collection('userss').add(userItem);
	}

	supprimerUser(id: string): Observable<any> {
		return from(this.afs.doc(`userss/${id}`).delete());
	}

	updateUser(user: User): Observable<any> {
		return from(this.afs.doc(`userss/${user.id}`).update(user));
	}


	addItem(item: Item) {
		this.items.push(item);
		return this.items;
	}

	getItems() {
		return this.items;
	}

	getItemById(id: Number) {
		return this.items.find(x => x.id === id);
	}

	public async takePicture() {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: true,
			resultType: CameraResultType.Uri
		});

		this.photos.unshift(
			{
				filepath: "img-" + Date.now(),
				webviewPath: image.webPath
			}
		)
	}

}

export interface Photo {
	filepath: string;
	webviewPath: string;
}

export interface Item {
	id: number,
	location: string,
	image: Photo[]
}