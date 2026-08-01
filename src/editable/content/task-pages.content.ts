import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Field journal',
    headline: 'Reported pieces, essays, and slower reads from the community.',
    description:
      'A calmer reading surface for long-form work — set in generous type with room to breathe between paragraphs.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading is a service. We give the words the space they need.',
    chips: ['Long-form', 'Editorial', 'Slow reading'],
  },
  classified: {
    eyebrow: 'Noticeboard',
    headline: 'Short-form calls, offers, and asks from around the community.',
    description:
      'The noticeboard is for the practical stuff — a hand needed, a room available, a tool to borrow — kept quick to scan.',
    filterLabel: 'Filter noticeboard',
    secondaryNote: 'Straight to the point. Contact, act, move on.',
    chips: ['Quick scan', 'Offers & asks', 'Action first'],
  },
  sbm: {
    eyebrow: 'Shelf',
    headline: 'Links, tools, and references our editors keep coming back to.',
    description:
      'A shared shelf of resources — grouped by collection, easy to graze, always safe to bookmark.',
    filterLabel: 'Filter shelf',
    secondaryNote: 'Curated by hand. Nothing on the shelf is a sponsored link.',
    chips: ['Collections', 'Reference', 'Editors’ picks'],
  },
  profile: {
    eyebrow: 'Neighbours',
    headline: 'People and organisations behind the directory.',
    description:
      'Meet the shopkeepers, makers, and organisers whose work fills the Community Directory.',
    filterLabel: 'Filter neighbours',
    secondaryNote: 'Identity, role, and contact — visible on the card, not buried.',
    chips: ['Verified', 'Local', 'Community-led'],
  },
  pdf: {
    eyebrow: 'Field Notes',
    headline: 'Downloadable guides, briefs, and reference material.',
    description:
      'A quiet library of open files — pull one down, read it offline, share it forward. Every entry lists format, size, and last update.',
    filterLabel: 'Filter Field Notes',
    secondaryNote: 'Open formats. No sign-up required. Full text search across every file.',
    chips: ['Guides', 'Briefs', 'Open files'],
  },
  listing: {
    eyebrow: 'Community Directory',
    headline: 'Verified places, people, and organisations you can visit today.',
    description:
      'Every record in the directory is reviewed by a human editor before it goes live — with address, hours, contact, and a note on what makes it worth the trip.',
    filterLabel: 'Filter directory',
    secondaryNote: 'Reviewed by editors. Updated when the neighbourhood tells us something’s changed.',
    chips: ['Verified records', 'Editor reviewed', 'Neighbourhood-first'],
  },
  image: {
    eyebrow: 'Contact sheet',
    headline: 'A rolling contact sheet from the community lens.',
    description:
      'Photographs from around the directory — events, portraits, neighbourhood scenes — laid out plainly, one frame at a time.',
    filterLabel: 'Filter contact sheet',
    secondaryNote: 'Credited to the photographer. Downloads at working resolution.',
    chips: ['Photojournalism', 'Portraits', 'Neighbourhood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
