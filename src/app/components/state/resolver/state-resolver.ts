import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { State } from "../../../models/state.model";
import { StateService } from "../../../services/state.service";
import { inject } from "@angular/core";

export const stateResolver: ResolveFn<State> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(StateService).findById(route.paramMap.get('id')!);
    }