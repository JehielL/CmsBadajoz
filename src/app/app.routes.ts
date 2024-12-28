import { Routes } from '@angular/router';
import { TokyoHomeComponent } from './tokyo-home/tokyo-home.component';
import { EventosComponent } from './eventos/eventos.component';
import { MultimediaComponent } from './multimedia/multimedia.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { OfertasComponent } from './ofertas/ofertas.component';
import { RutasComponent } from './rutas/rutas.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { DashboarduserComponent } from './dashboarduser/dashboarduser.component';
import { HomeSinLogComponent } from './home-sin-log/home-sin-log.component';
import { userLoggedInGuard } from './services/user-logged-in.guard';
import { userRoleGuard } from './services/user-role.guard';
import { EventosbadajozComponent } from './eventosbadajoz/eventosbadajoz.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { TestTensorflowComponent } from './test-tensorflow/test-tensorflow.component';
import { PoiListComponent } from './poi-list/poi-list.component';
import { PoiDetailComponent } from './poi-detail/poi-detail.component';

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
        path: 'eventos/find-by-user/:id',
        component: EventosComponent,
        canActivate: [userRoleGuard]
        
    },
    {
        path: 'poi',
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
    },
    {
        path: 'eventosbadajoz',
        component: EventosbadajozComponent
    },
    {
        path: 'noticiasbadajoz',
        component: NoticiasComponent
    },
    {
        path: 'empresas',
        component: EmpresasComponent
    },
    {
        path: 'reconocimientofacial',
        component: TestTensorflowComponent
    },
    {
        path: 'poi-list',
        component: PoiListComponent
    },
    {
        path: 'detalle-poi/:id',
        component: PoiDetailComponent
    }
    
];
