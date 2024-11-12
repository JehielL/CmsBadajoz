import { Routes } from '@angular/router';
import { TokyoHomeComponent } from './tokyo-home/tokyo-home.component';
import { EventosComponent } from './eventos/eventos.component';
import { MultimediaComponent } from './multimedia/multimedia.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { PuntosinteresComponent } from './puntosinteres/puntosinteres.component';
import { RutasComponent } from './rutas/rutas.component';
import { FavoritosComponent } from './favoritos/favoritos.component';

export const routes: Routes = [
    {
        path: '',
        component: TokyoHomeComponent
    },

    {
        path: 'tokyo-home',
        component: TokyoHomeComponent
    },
    {
        path: 'eventos',
        component: EventosComponent
    },
    {
        path: 'multimedia',
        component: MultimediaComponent
    },
    {
        path: 'noticias',
        component: NoticiasComponent
    },
    {
        path: 'ofertas',
        component: OfertasComponent
    },
    {
        path: 'puntos-interes',
        component: PuntosinteresComponent
    },
    {
        path: 'rutas',
        component: RutasComponent
    },
    {
        path: 'favoritos',
        component: FavoritosComponent
    }
];
