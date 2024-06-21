import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Collection } from "../../../models/collection.model";
import { CollectionService } from "../../../services/collection.service";
import { inject } from "@angular/core";

export const collectionResolver: ResolveFn<Collection> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(CollectionService).findById(route.paramMap.get('id')!);
    }