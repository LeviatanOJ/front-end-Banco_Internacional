import { Routes } from '@angular/router';
import { Landing } from './components/landing/landing';
import { Campeonato } from './components/campeonato/campeonato';
import { MorningActivate } from './components/morning-activate/morning-activate';
import { Clubes } from './components/clubes/clubes';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'campeonato', component: Campeonato },
  { path: 'manana-activate', component: MorningActivate },
  { path: 'clubes', component: Clubes },
  { path: '**', redirectTo: '' },
];
