import { Routes } from '@angular/router';
import { TokyoHomeComponent } from './tokyo-home/tokyo-home.component';
import { EventosComponent } from './eventos/eventos.component';
import { MultimediaComponent } from './multimedia/multimedia.component';
import { RutasComponent } from './rutas/rutas.component';
import { HomeSinLogComponent } from './home-sin-log/home-sin-log.component';
import { userLoggedInGuard } from './services/user-logged-in.guard';
import { userRoleGuard } from './services/user-role.guard';
import { EventosbadajozComponent } from './eventosbadajoz/eventosbadajoz.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { PoiListComponent } from './poi-list/poi-list.component';
import { PoiDetailComponent } from './poi-detail/poi-detail.component';
import { RutasListComponent } from './rutas-list/rutas-list.component';
import { RutaDetailComponent } from './ruta-detail/ruta-detail.component';
import { EventosListComponent } from './eventos-list/eventos-list.component';
import { EventosDetailComponent } from './eventos-detail/eventos-detail.component';
import { EmpresasListComponent } from './empresas-list/empresas-list.component';
import { EmpresasDetailComponent } from './empresas-detail/empresas-detail.component';
import { NoticiasListComponent } from './noticias-list/noticias-list.component';
import { NoticiasDetailComponent } from './noticias-detail/noticias-detail.component';

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
        path: 'rutas',
        component: RutasComponent
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
        path: 'empresas',
        component: EmpresasComponent
    },
    {
        path: 'poi-list',
        component: PoiListComponent
    },
    {
        path: 'detalle-poi/:id',
        component: PoiDetailComponent
    },
    {
        path: 'rutas-list',
        component: RutasListComponent
    },
    {
        path: 'detalle-ruta/:id',
        component: RutaDetailComponent
    },
    {
        path: 'eventos-list',
        component: EventosListComponent
    },
    {
        path: 'detalle-evento/:id',
        component: EventosDetailComponent
    },
    {
        path: 'empresas-list',
        component: EmpresasListComponent
    },
    {
        path: 'detalle-empresa/:id',
        component: EmpresasDetailComponent
    },
    {
        path: 'noticias-list',
        component: NoticiasListComponent
    },
    {
        path: 'detalle-noticia/:id',
        component: NoticiasDetailComponent
    }
    
];
