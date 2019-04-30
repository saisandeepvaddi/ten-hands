export function catchErrors(routeHandler) {
  return function(req, res, next) {
    return routeHandler(req, res).catch(error => next(error));
  };
}
