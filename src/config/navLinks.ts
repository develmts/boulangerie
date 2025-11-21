// src/config/navLinks.ts

export type NavLink = {
  key: string;
  to: string;
  label: string;
};

export function createNavLinks(t: (key: string) => string, localePath: (path: string) => string): NavLink[] {
  return [
    {
      key: 'home',
      to: localePath('/'),
      label: t('nav.home'),
    },
    {
      key: 'shop',
      to: localePath('/shop'),
      label: t('nav.shop'),
    },
    {
      key: 'contact',
      to: localePath('/contact'),
      label: t('nav.contact'),
    },
    {
      key: 'blog',
      to: localePath('/blog'),
      label: t('nav.blog'),
    },
    {
      key: 'faq',
      to: localePath('/faq'),
      label: t('nav.faq'),
    },

    {
      key: 'about',
      to: localePath('/about'),
      label: t('nav.about'),
    },

  ];
}
