import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — Community Directory & Field Notes`,
      description:
        'A neighbourhood-run directory of local places, people, and organisations — alongside an open library of downloadable guides and reference material.',
      openGraphTitle: `${slot4BrandConfig.siteName} — Community Directory & Field Notes`,
      openGraphDescription:
        'Verified local records, editor-reviewed. Open files you can read, save, and share.',
      keywords: [
        'community directory',
        'local business directory',
        'open library',
        'downloadable guides',
        'neighbourhood',
      ],
    },
    hero: {
      badge: 'Directory + open library',
      title: [
        'Verified local records, reviewed by hand.',
        'Open files, ready when you are.',
      ],
      description:
        `${slot4BrandConfig.siteName} keeps a hand-verified directory of the places, people, and organisations around us — and a shelf of downloadable Field Notes any neighbour can read, save, or forward.`,
      primaryCta: { label: 'Browse the directory', href: '/listings' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
      searchPlaceholder: 'Search a name, a category, a title…',
      focusLabel: 'Right now',
      featureCardBadge: 'This week',
      featureCardTitle: 'Every record in the directory is reviewed by a human editor.',
      featureCardDescription:
        'Address, hours, and contact are checked before a listing goes live — and re-checked when neighbours flag a change.',
    },
    intro: {
      badge: 'About this place',
      title: 'A quiet, community-run home for local information.',
      paragraphs: [
        `${slot4BrandConfig.siteName} exists to make it easier for a neighbour to find a butcher, a school, a plumber, or a reading room without wading through ranked ads.`,
        'The directory is verified by human editors before publication, and the open library is stocked with files the community actually needs — licence templates, meeting minutes, small-business guides, safety briefs.',
        'Nothing here is pay-to-list, and nothing on the shelf is a sponsored link.',
      ],
      sideBadge: 'The rhythm',
      sidePoints: [
        'Directory records reviewed by hand.',
        'Field Notes downloadable in the open.',
        'No pay-to-list, no sponsored placements.',
        'Neighbours can submit; editors can publish.',
      ],
      primaryLink: { label: 'Browse the directory', href: '/listings' },
      secondaryLink: { label: 'Open the library', href: '/pdf' },
    },
    cta: {
      badge: 'Add to the record',
      title: 'Know a place we’ve missed? Add it to the directory.',
      description:
        'Submit a business, a service, or a community group and an editor will review it within a few days. If you have a file to share, add it to the library instead.',
      primaryCta: { label: 'Submit a record', href: '/create' },
      secondaryCta: { label: 'Talk to the editors', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Fresh entries from this section.',
    },
  },
  about: {
    badge: 'About the platform',
    title: 'A neighbourhood directory and an open library, run in the open.',
    description: `${slot4BrandConfig.siteName} is a two-part community platform — a verified directory of local places and people, plus a shelf of open files anyone can download. It exists to make useful local information easier to find, and easier to trust.`,
    paragraphs: [
      'The directory is compiled by a small editorial team. Every record is reviewed against a public checklist before publication: address, hours, contact details, and a plain description of what the place actually is. Anyone can submit; editors publish.',
      'The open library sits alongside the directory as a shelf of downloadable Field Notes — licence templates, community meeting minutes, small-business guides, and reference briefs. Files are hosted in the open, checked for format, and marked with a last-updated date.',
      'We are funded independently, we do not accept paid placements, and we do not rank entries by anything other than what an editor believes is useful.',
    ],
    values: [
      {
        title: 'Reviewed by hand',
        description:
          'Every directory record and every library file passes an editor before it goes live. No auto-scraping, no sponsored slots.',
      },
      {
        title: 'Open by default',
        description:
          'Field Notes are downloadable without a sign-up. The directory is free to browse, free to submit to, free to correct.',
      },
      {
        title: 'Neighbourhood-first',
        description:
          'We prioritise records with a real local address and a real person to talk to. Chains and platforms come second.',
      },
    ],
  },
  contact: {
    eyebrow: `Write to ${slot4BrandConfig.siteName}`,
    title: 'Reach an editor — for corrections, submissions, or a quiet word.',
    description:
      'Directory corrections, missing records, broken files, or a Field Note you’d like added — a human reads every message and replies within two working days.',
    formTitle: 'Send a note',
  },
  search: {
    metadata: {
      title: 'Search',
      description:
        'Search the community directory and the open library in one place.',
    },
    hero: {
      badge: 'Everything, one field',
      title: 'Search the directory and the library at once.',
      description:
        'Type a name, a category, or a title. Results are grouped by type so you can jump straight to what you need.',
      placeholder: 'Type a name, category, or title…',
    },
    resultsTitle: 'Matching records and files',
  },
  create: {
    metadata: {
      title: 'Submit a record',
      description:
        'Add a directory record or upload a file to the open library.',
    },
    locked: {
      badge: 'Editor access',
      title: 'Sign in to add to the directory or the library.',
      description:
        'An account lets you submit directory records for review, upload files to the library, and track what an editor has picked up.',
    },
    hero: {
      badge: 'Submissions desk',
      title: 'Add a place to the directory, or a file to the library.',
      description:
        'Fill in what you know — an editor will read it, check the details, and reply within a few days. If we need more, we’ll ask.',
    },
    formTitle: 'Submission details',
    submitLabel: 'Send to editors',
    successTitle: 'Sent — an editor will be in touch.',
  },
  auth: {
    login: {
      metadataDescription: `Sign in to ${slot4BrandConfig.siteName}.`,
      badge: 'Member sign-in',
      title: 'Welcome back to the editors’ desk.',
      description:
        'Sign in to track your submissions, upload files to the library, and manage the records you’ve added to the directory.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount:
        'That combination didn’t match. Try again, or create an account.',
      success: 'Signed in — taking you back to your work.',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: `Create an account on ${slot4BrandConfig.siteName}.`,
      badge: 'New member',
      title: 'Set up an account and add to the record.',
      description:
        'An account unlocks the submissions desk, the file uploader for the library, and the ability to leave notes on your own records.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least four characters.',
      success: 'Account ready — taking you to the desk.',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'From the field journal',
      fallbackTitle: 'Field journal entry',
    },
    listing: {
      relatedTitle: 'Other neighbours in the directory',
      fallbackTitle: 'Directory record',
    },
    image: {
      relatedTitle: 'More frames from the contact sheet',
      fallbackTitle: 'Contact sheet frame',
    },
    profile: {
      relatedTitle: 'Recent from this neighbour',
      fallbackDescription:
        'The full profile will appear here once an editor has reviewed it.',
      visitButton: 'Visit their site',
    },
  },
} as const
