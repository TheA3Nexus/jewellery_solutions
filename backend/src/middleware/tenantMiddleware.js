// Multi-tenant resolution middleware
const DEFAULT_TENANT_ID = 'A3_JEWELLERY_01';

function tenantMiddleware(req, res, next) {
  req.tenantId = req.headers['x-tenant-id'] || DEFAULT_TENANT_ID;
  next();
}

module.exports = tenantMiddleware;
