import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatasetComponent } from './dataset/dataset.component';
import { HomeComponent } from './home/home.component';
import { PlayGameComponent } from './play-game/play-game.component';

const routes: Routes = [
  {path:'CreateDatasets',component:DatasetComponent},
  {path:'PlayGame',component:PlayGameComponent},
  {path:'',component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents =[DatasetComponent,PlayGameComponent,HomeComponent]