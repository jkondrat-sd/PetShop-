import * as request from '~/utils/request';

export const getSalesOverview = (range) => request.get('/reports/sales/overview', { params: range });
export const getSalesChart = (range) => request.get('/reports/sales/chart', { params: range });
export const getTopProducts = (range) => request.get('/reports/sales/top-products', { params: range });
export const getInventoryPie = () => request.get('/reports/inventory/pie');
export const getLowStockProducts = () => request.get('/reports/inventory/low-stock');
