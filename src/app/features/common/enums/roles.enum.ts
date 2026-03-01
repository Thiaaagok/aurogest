export const Permisos = {
  // Usuarios
  VER_USUARIOS: 'ver-usuarios',
  CREAR_USUARIO: 'crear-usuario',
  EDITAR_USUARIO: 'editar-usuario',
  ELIMINAR_USUARIO: 'eliminar-usuario',

  //
  VER_ROLES: 'ver-roles',
  CREAR_ROL: 'crear-rol',
  EDITAR_ROL: 'editar-rol',
  ELIMINAR_ROL: 'eliminar-rol',

  // Empresas
  VER_EMPRESAS: 'ver-empresas',
  CREAR_EMPRESA: 'crear-empresa',
  EDITAR_EMPRESA: 'editar-empresa',
  ELIMINAR_EMPRESA: 'eliminar-empresa',

  // Proveedores
  VER_PROVEEDORES: 'ver-proveedores',
  CREAR_PROVEEDOR: 'crear-proveedor',
  EDITAR_PROVEEDOR: 'editar-proveedor',
  ELIMINAR_PROVEEDOR: 'eliminar-proveedor',

  // Productos
  VER_PRODUCTOS: 'ver-productos',
  CREAR_PRODUCTO: 'crear-producto',
  EDITAR_PRODUCTO: 'editar-producto',
  ELIMINAR_PRODUCTO: 'eliminar-producto',

  // Marcas
  VER_MARCAS: 'ver-marcas',
  CREAR_MARCA: 'crear-marca',
  EDITAR_MARCA: 'editar-marca',
  ELIMINAR_MARCA: 'eliminar-marca',

  // Tipos de producto
  VER_TIPOS_PRODUCTO: 'ver-tipos-producto',
  CREAR_TIPO_PRODUCTO: 'crear-tipo-producto',
  EDITAR_TIPO_PRODUCTO: 'editar-tipo-producto',
  ELIMINAR_TIPO_PRODUCTO: 'eliminar-tipo-producto',

  // Categorías de producto
  VER_CATEGORIAS_PRODUCTO: 'ver-categorias-producto',
  CREAR_CATEGORIA_PRODUCTO: 'crear-categoria-producto',
  EDITAR_CATEGORIA_PRODUCTO: 'editar-categoria-producto',
  ELIMINAR_CATEGORIA_PRODUCTO: 'eliminar-categoria-producto',

  // Stock
  VER_STOCK: 'ver-stock',

  // Compras
  CREAR_COMPRA: 'crear-compra',
  VER_HISTORICO_COMPRAS: 'ver-historico-compras',

  // Ventas
  CREAR_VENTA: 'crear-venta',
  VER_HISTORICO_VENTAS: 'ver-historico-ventas',
} as const;

export const permisosDisponibles = [
  {
    label: 'Usuarios',
    items: [
      { label: 'Ver usuarios', value: Permisos.VER_USUARIOS },
      { label: 'Crear usuario', value: Permisos.CREAR_USUARIO },
      { label: 'Editar usuario', value: Permisos.EDITAR_USUARIO },
      { label: 'Eliminar usuario', value: Permisos.ELIMINAR_USUARIO },
    ],
  },
  {
    label: 'Roles',
    items: [
      { label: 'Ver roles', value: Permisos.VER_ROLES },
      { label: 'Crear rol', value: Permisos.CREAR_ROL },
      { label: 'Editar rol', value: Permisos.EDITAR_ROL },
      { label: 'Eliminar rol', value: Permisos.ELIMINAR_ROL },
    ],
  },
  {
    label: 'Empresas',
    items: [
      { label: 'Ver empresas', value: Permisos.VER_EMPRESAS },
      { label: 'Crear empresa', value: Permisos.CREAR_EMPRESA },
      { label: 'Editar empresa', value: Permisos.EDITAR_EMPRESA },
      { label: 'Eliminar empresa', value: Permisos.ELIMINAR_EMPRESA },
    ],
  },
  {
    label: 'Proveedores',
    items: [
      { label: 'Ver proveedores', value: Permisos.VER_PROVEEDORES },
      { label: 'Crear proveedor', value: Permisos.CREAR_PROVEEDOR },
      { label: 'Editar proveedor', value: Permisos.EDITAR_PROVEEDOR },
      { label: 'Eliminar proveedor', value: Permisos.ELIMINAR_PROVEEDOR },
    ],
  },
  {
    label: 'Productos',
    items: [
      { label: 'Ver productos', value: Permisos.VER_PRODUCTOS },
      { label: 'Crear producto', value: Permisos.CREAR_PRODUCTO },
      { label: 'Editar producto', value: Permisos.EDITAR_PRODUCTO },
      { label: 'Eliminar producto', value: Permisos.ELIMINAR_PRODUCTO },
    ],
  },
  {
    label: 'Marcas',
    items: [
      { label: 'Ver marcas', value: Permisos.VER_MARCAS },
      { label: 'Crear marca', value: Permisos.CREAR_MARCA },
      { label: 'Editar marca', value: Permisos.EDITAR_MARCA },
      { label: 'Eliminar marca', value: Permisos.ELIMINAR_MARCA },
    ],
  },
  {
    label: 'Tipos de Producto',
    items: [
      { label: 'Ver tipos', value: Permisos.VER_TIPOS_PRODUCTO },
      { label: 'Crear tipo', value: Permisos.CREAR_TIPO_PRODUCTO },
      { label: 'Editar tipo', value: Permisos.EDITAR_TIPO_PRODUCTO },
      { label: 'Eliminar tipo', value: Permisos.ELIMINAR_TIPO_PRODUCTO },
    ],
  },
  {
    label: 'Categorías de Producto',
    items: [
      { label: 'Ver categorías', value: Permisos.VER_CATEGORIAS_PRODUCTO },
      { label: 'Crear categoría', value: Permisos.CREAR_CATEGORIA_PRODUCTO },
      { label: 'Editar categoría', value: Permisos.EDITAR_CATEGORIA_PRODUCTO },
      {
        label: 'Eliminar categoría',
        value: Permisos.ELIMINAR_CATEGORIA_PRODUCTO,
      },
    ],
  },
  {
    label: 'Stock',
    items: [{ label: 'Ver stock', value: Permisos.VER_STOCK }],
  },
  {
    label: 'Compras',
    items: [
      { label: 'Crear compra', value: Permisos.CREAR_COMPRA },
      { label: 'Ver histórico compras', value: Permisos.VER_HISTORICO_COMPRAS },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { label: 'Crear venta', value: Permisos.CREAR_VENTA },
      { label: 'Ver histórico ventas', value: Permisos.VER_HISTORICO_VENTAS },
    ],
  },
];

export type PermisoKey = (typeof Permisos)[keyof typeof Permisos];
