import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [

  {
    navCap: 'Gestión ',
  },
  {
    displayName: 'Clientes',
    iconName: 'users',
    route: '/clients',
  },
  {
    displayName: 'Codeudores',
    iconName: 'users',
    route: '/codebtors',
  },
  {
    displayName: 'Créditos',
    iconName: 'report-money',
    route: '/credits',
  },
    {
    navCap: 'Administración',
  },
  {
    displayName: 'Usuarios',
    iconName: 'user',
    route: '/users',
  },
  {
    displayName: 'Empresas',
    iconName: 'building-community',
    route: '/companies',
  },
  {
    displayName: 'Sedes',
    iconName: 'home-2',
    route: '/sedes',
  },
  {
    displayName: 'Moverse de sede',
    iconName: 'home-move',
    route: '/move/sede',
  },
  {
    displayName: 'Actualizar contraseña',
    iconName: 'password',
    route: '/update/password',
  },
];
