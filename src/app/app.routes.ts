import { Routes } from '@angular/router';

import { StateListComponent } from './components/state/state-list/state-list.component';
import { StateFormComponent } from './components/state/state-form/state-form.component';
import { stateResolver } from './components/state/resolver/state-resolver';

import { CityListComponent } from './components/city/city-list/city-list.component';
import { CityFormComponent } from './components/city/city-form/city-form.component';
import { cityResolver } from './components/city/resolver/city-resolver';

import { MangaListComponent } from './components/manga/manga-list/manga-list.component';
import { MangaFormComponent } from './components/manga/manga-form/manga-form.component';
import { mangaResolver } from './components/manga/resolver/manga-resolver';

import { GenreListComponent } from './components/genre/genre-list/genre-list.component';
import { GenreFormComponent } from './components/genre/genre-form/genre-form.component';
import { genreResolver } from './components/genre/resolver/genre-resolver';

import { PublisherListComponent } from './components/publisher/publisher-list/publisher-list.component';
import { PublisherFormComponent } from './components/publisher/publisher-form/publisher-form.component';
import { publisherResolver } from './components/publisher/resolver/publisher-resolver';

import {AuthorListComponent } from './components/author/author-list/author-list.component';
import {AuthorFormComponent } from './components/author/author-form/author-form.component';
import {authorResolver } from './components/author/resolver/author-resolver';

import {CollectionListComponent } from './components/collection/collection-list/collection-list.component';
import {CollectionFormComponent } from './components/collection/collection-form/collection-form.component';
import {collectionResolver } from './components/collection/resolver/collection-resolver';

import {UserListComponent } from './components/user/user-list/user-list.component';
import {UserFormComponent } from './components/user/user-form/user-form.component';
import {userResolver } from './components/user/resolver/user-resolver';

import { LoginComponent } from './components/login/login.component';
import { MangaCardListComponent } from './components/manga-card-list/manga-card-list.component';
import { UserTemplateComponent } from './components/template/user-template/user-template.component';
import { AdminTemplateComponent } from './components/template/admin-template/admin-template.component';
import { CartComponent } from './components/cart/cart.component';
import { SignupComponent } from './components/sign-up/sign-up.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { MangaDetailComponent } from './components/manga-detail/manga-detail.component';
import { SearchResultsComponent } from './components/search-result/search-results.component';
import { GenreSearchComponent } from './components/genre-search/genre-search.component';
import { CollectionSearchComponent } from './components/collection-search/collection-search.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderDetailsComponent } from './components/order-detail/order-details.component';
import { UserUpdateInfoComponent } from './components/user-update-info/user-update-info.component';
import { UserUpdatePasswordComponent } from './components/user-update-password/user-update-password.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AdminGuard } from './guard/admin-guard';
import { AuthGuard } from './guard/auth-guard';
import { FinishPaymentComponent } from './components/finishPayment/finishPayment.component';

export const routes: Routes = [

    {
        path: '',
        component: UserTemplateComponent,
        title: 'e-commerce',
        children: [
            { path: '', component: HomePageComponent, title: 'Homie Mangas' },
             
            { path: 'login', component: LoginComponent, title: 'Login'},
            { path: 'signup', component: SignupComponent, title: 'Cadastro'},
            { path: 'products', component: MangaCardListComponent, title: 'Produtos à Venda'},
            { path: 'cart', component: CartComponent, title: 'Carrinho de pedidos'},
            { path: 'finish-order', component: FinishPaymentComponent, title: 'Finalizar a compra'},

            { path: 'profile', component: UserDashboardComponent, title: 'Perfil', canActivate: [AuthGuard]},
            { path: 'profile/', component: UserDashboardComponent, title: 'Perfil', canActivate: [AuthGuard]},
            { path: 'profile/update', component: UserUpdateInfoComponent, title: 'Atualizar Informações', canActivate: [AuthGuard]},
            { path: 'profile/senha', component: UserUpdatePasswordComponent, title: 'Atualizar Senha', canActivate: [AuthGuard]},
            { path: 'profile/orders', component: OrderHistoryComponent, title: 'Historico de Vendas', canActivate: [AuthGuard]},
            { path: 'order-details/:id', component: OrderDetailsComponent, title: 'Informações do Pedido', canActivate: [AuthGuard]},

            { path: 'manga/:id', component: MangaDetailComponent, title: 'Produto'},
            { path: 'search/:name', component: SearchResultsComponent, title: 'Pesquisa de Produto'},
            { path: 'search/genero/:id', component: GenreSearchComponent, title: 'Pesquisa por Genero'},
            { path: 'search/colecao/:id', component: CollectionSearchComponent, title: 'Pesquisa por Coleção'},
        ]
    },
    {
        path: 'admin',
        component: AdminTemplateComponent,
        title: 'e-commerce',
        children: [
            { path: '', component: HomePageComponent, title: 'Homie Mangas', canActivate: [AdminGuard]},

            { path: 'products', component: MangaCardListComponent, title: 'Produtos à Venda', canActivate: [AdminGuard]},
            { path: 'cart', component: CartComponent, title: 'Carrinho de pedidos', canActivate: [AdminGuard]},
            { path: 'finish-order', component: FinishPaymentComponent, title: 'Finalizar a compra', canActivate: [AdminGuard]},

            { path: 'profile', component: UserDashboardComponent, title: 'Perfil', canActivate: [AdminGuard]},
            { path: 'profile/', component: UserDashboardComponent, title: 'Perfil', canActivate: [AdminGuard]},
            { path: 'profile/update', component: UserUpdateInfoComponent, title: 'Atualizar Informações', canActivate: [AdminGuard]},
            { path: 'profile/senha', component: UserUpdatePasswordComponent, title: 'Atualizar Senha', canActivate: [AdminGuard]},
            { path: 'profile/orders', component: OrderHistoryComponent, title: 'Historico de Vendas', canActivate: [AdminGuard]},
            { path: 'order-details/:id', component: OrderDetailsComponent, title: 'Informações do Pedido', canActivate: [AdminGuard]},

            { path: 'manga/:id', component: MangaDetailComponent, title: 'Produto', canActivate: [AdminGuard]},
            { path: 'search/:name', component: SearchResultsComponent, title: 'Pesquisa de Produto', canActivate: [AdminGuard]},
            { path: 'search/genero/:id', component: GenreSearchComponent, title: 'Pesquisa por Genero', canActivate: [AdminGuard]},
            { path: 'search/colecao/:id', component: CollectionSearchComponent, title: 'Pesquisa por Coleção', canActivate: [AdminGuard]},

            { path: 'states', component: StateListComponent, title: 'Lista de Estados', canActivate: [AdminGuard]},
            { path: 'states/new', component: StateFormComponent, title: 'Novo Estado', canActivate: [AdminGuard]},
            { path: 'states/edit/:id', component: StateFormComponent, resolve: {state: stateResolver}, canActivate: [AdminGuard]},
    
            { path: 'cities', component: CityListComponent, title: 'Lista de Municipios', canActivate: [AdminGuard]},
            { path: 'cities/new', component: CityFormComponent, title: 'Novo Municipio', canActivate: [AdminGuard]},
            { path: 'cities/edit/:id', component: CityFormComponent, resolve: {city: cityResolver}, canActivate: [AdminGuard]},
    
            { path: 'mangas', component: MangaListComponent, title: 'Lista de Mangas', canActivate: [AdminGuard]},
            { path: 'mangas/new', component: MangaFormComponent, title: 'Novo Manga', canActivate: [AdminGuard]},
            { path: 'mangas/edit/:id', component: MangaFormComponent, resolve: {manga: mangaResolver}, canActivate: [AdminGuard]},

            { path: 'genres', component: GenreListComponent, title: 'Lista de Generos', canActivate: [AdminGuard]},
            { path: 'genres/new', component: GenreFormComponent, title: 'Novo Genero', canActivate: [AdminGuard]},
            { path: 'genres/edit/:id', component: GenreFormComponent, resolve: {genre: genreResolver}, canActivate: [AdminGuard]},

            { path: 'publishers', component: PublisherListComponent, title: 'Lista de Publicadoras', canActivate: [AdminGuard]},
            { path: 'publishers/new', component: PublisherFormComponent, title: 'Nova Publicadora', canActivate: [AdminGuard]},
            { path: 'publishers/edit/:id', component: PublisherFormComponent, resolve: {publisher: publisherResolver}, canActivate: [AdminGuard]},
    
            { path: 'authors', component: AuthorListComponent, title: 'Lista de Autores', canActivate: [AdminGuard]},
            { path: 'authors/new', component: AuthorFormComponent, title: 'Novo Autor', canActivate: [AdminGuard]},
            { path: 'authors/edit/:id', component: AuthorFormComponent, resolve: {author: authorResolver}, canActivate: [AdminGuard]},

            { path: 'users', component: UserListComponent, title: 'Lista de Autores', canActivate: [AdminGuard]},
            { path: 'users/new', component: UserFormComponent, title: 'Novo Autor', canActivate: [AdminGuard]},
            { path: 'users/edit/:id', component: UserFormComponent, resolve: {user: userResolver}, canActivate: [AdminGuard]},

            { path: 'collections', component: CollectionListComponent, title: 'Lista de Coleções', canActivate: [AdminGuard]},
            { path: 'collections/new', component: CollectionFormComponent, title: 'Nova Coleção', canActivate: [AdminGuard]},
            { path: 'collections/edit/:id', component: CollectionFormComponent, resolve: {collection: collectionResolver}, canActivate: [AdminGuard]},
        ]
    },
];
