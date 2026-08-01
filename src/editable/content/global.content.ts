import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A community directory and open library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A community directory and open library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Sign in', href: '/login' },
    },
  },
  footer: {
    tagline: 'A community directory and an open library',
    description:
      'A quietly-run directory of places, people, and organisations in the neighbourhood — plus a shelf of open files you can download, read, and forward.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Community Directory', href: '/listings' },
          { label: 'Field Notes', href: '/pdf' },
          { label: 'Field journal', href: '/articles' },
          { label: 'Contact sheet', href: '/image-sharing' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Search', href: '/search' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Sign in', href: '/login' },
          { label: 'Get started', href: '/signup' },
          { label: 'Submit a record', href: '/create' },
        ],
      },
    ],
    bottomNote: 'Independently run. Made in the neighbourhood.',
  },
  commonLabels: {
    readMore: 'Continue reading',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Updated',
  },
} as const
