import { Routes } from '@angular/router';
import { TokyoHomeComponent } from './tokyo-home/tokyo-home.component';
import { EventosComponent } from './eventos/eventos.component';
import { MultimediaComponent } from './multimedia/multimedia.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { PuntosinteresComponent } from './puntosinteres/puntosinteres.component';
import { RutasComponent } from './rutas/rutas.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { DashboarduserComponent } from './dashboarduser/dashboarduser.component';
import { HomeSinLogComponent } from './home-sin-log/home-sin-log.component';
import { userLoggedInGuard } from './services/user-logged-in.guard';
import { userRoleGuard } from './services/user-role.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeSinLogComponent
    },

    {
        path: 'tokyo-home',
        component: TokyoHomeComponent
    },
    {
        path: 'eventos/find-by-user/:id',
        component: EventosComponent,
        canActivate: [userRoleGuard]
        
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
    },
    {
        path: 'configuracion',
        component: DashboarduserComponent,
        canActivate: [userLoggedInGuard]

    },
    {
        path: 'homelogout',
        component: HomeSinLogComponent
    }
];
