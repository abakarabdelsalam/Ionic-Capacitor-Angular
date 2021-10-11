import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EditModalPage } from './edit-modal/edit-modal.page';
const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
	},
	{
		path: 'details',
		loadChildren: () => import('./edit-modal/edit-modal.module').then(m => m.EditModalPageModule)
	},
	{
		path: 'details/:id',
		component: EditModalPage
	}

];
@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule { }
