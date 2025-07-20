// Auth hooks
export * from './auth/useLogin';
export * from './auth/useRegister';
export * from './auth/useUser';
export * from './auth/useCustomer';
export * from './auth/useRoleUser';

// Product hooks (mantener temporalmente)
export * from './products/useProducts';
export * from './products/useProduct';
export * from './products/useCreateProduct';
export * from './products/useUpdateProduct';
export * from './products/useDeleteProduct';
export * from './products/useHomeProducts';
export * from './products/useFilteredProducts';

// Book hooks (nuevos)
export * from './books/useBooks';
export * from './books/useBook';
export * from './books/useCreateBook';
export * from './books/useUpdateBook';
export * from './books/useDeleteBook';
export * from './books/useHomeBooks';
export * from './books/useTestConnection';

// Author hooks (nuevos)
export * from './authors/useAuthors';
export * from './authors/useCreateAuthor';

// Order hooks (mantener para reservas)
export * from './orders/useOrders';
export * from './orders/useOrder';
export * from './orders/useCreateOrder';
export * from './orders/useOrderAdmin';
export * from './orders/useAllOrders';
export * from './orders/useChangeStatusOrder';
