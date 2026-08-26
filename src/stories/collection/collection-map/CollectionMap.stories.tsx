import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { CollectionMapUI } from '@/sections/collection/collection-map/CollectionMap'
import { GeoDatasetItem } from '@/sections/collection/collection-map/types'

const meta: Meta<typeof CollectionMapUI> = {
  title: 'Sections/Collection Page/CollectionMap',
  component: CollectionMapUI,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof CollectionMapUI>

const mockItems: GeoDatasetItem[] = [
  {
    persistentId: 'doi:10.1234/1',
    name: 'Cluster dataset 1',
    url: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 52.6,
    pinLon: 6.5,
    bboxes: [
      [
        [52.6 - 0.1, 6.5 - 0.1],
        [52.6 + 0.1, 6.5 + 0.1]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/2',
    name: 'Cluster dataset 2',
    url: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 53,
    pinLon: 6.5,
    bboxes: [
      [
        [53 - 0.1, 6.5 - 0.1],
        [53 + 0.1, 6.5 + 0.1]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/3',
    name: 'Cluster dataset 3',
    url: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 52.8,
    pinLon: 6.2,
    bboxes: [
      [
        [52.8 - 0.1, 6.2 - 0.1],
        [52.8 + 0.1, 6.2 + 0.1]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/4',
    name: 'Dataset with large bounding box',
    url: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 52.8,
    pinLon: 8,
    bboxes: [
      [
        [52.8 - 5, 8 - 10],
        [52.8 + 5, 8 + 10]
      ]
    ]
  },
  {
    persistentId: 'doi:10.1234/5',
    name: 'Dataset with 2 bounding boxes',
    url: '',
    authors: 'Author Name',
    publicationDate: '2026-01-01',
    pinLat: 52.8,
    pinLon: 10.35,
    bboxes: [
      [
        [52.8 - 0.1, 10.2 - 0.1],
        [52.8 + 0.1, 10.2 + 0.1]
      ],
      [
        [52.8 - 0.1, 10.5 - 0.1],
        [52.8 + 0.1, 10.5 + 0.1]
      ]
    ]
  }
]

export const Default: Story = {
  args: {
    collectionId: 'root',
    isVisible: true,
    items: mockItems,
    totalCount: 5,
    isLoading: false,
    error: null,
    hasMore: false,
    loadMore: () => {}
  }
}

export const Loading: Story = {
  args: {
    ...Default.args,
    items: [],
    totalCount: 0,
    isLoading: true
  }
}

export const Error: Story = {
  args: {
    ...Default.args,
    items: [],
    totalCount: 0,
    error: 'Demo of an Error'
  }
}
