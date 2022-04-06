import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  static storedHandles = new Map<string, DetachedRouteHandle>();

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data?.['reuse'];
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (handle) {
      const key = this.getRouteKey(route);
      CustomReuseStrategy.storedHandles.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = this.getRouteKey(route);
    return CustomReuseStrategy.storedHandles.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getRouteKey(route);
    return CustomReuseStrategy.storedHandles.get(key) || null;
  }

  static removeCache(keyPrefix: string): void {
    if (keyPrefix) {
      const length = keyPrefix.length;
      for (let key of this.storedHandles.keys()) {
        if (key.slice(0, length) === keyPrefix) {
          const handle = this.storedHandles.get(key) as any;
          handle['componentRef'].destroy();
          this.storedHandles.delete(key);
        }
      }
    }
  }

  private getRouteKey(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .filter((activeRoute) => activeRoute.url)
      .map((activeRoute) => activeRoute.url)
      .join('');
  }
}
