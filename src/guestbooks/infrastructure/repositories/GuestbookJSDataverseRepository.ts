import {
  assignDatasetGuestbook,
  createGuestbook,
  downloadGuestbookResponsesByCollectionId,
  downloadGuestbookResponsesOfAGuestbook,
  type CreateGuestbookDTO,
  type GuestbookResponseSubset,
  getGuestbooksByCollectionId,
  getGuestbook,
  getGuestbookResponsesByGuestbookId,
  setGuestbookEnabled,
  removeDatasetGuestbook
} from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '../../domain/repositories/GuestbookRepository'
import { Guestbook } from '../../domain/models/Guestbook'

export class GuestbookJSDataverseRepository implements GuestbookRepository {
  createGuestbook(
    collectionIdOrAlias: number | string,
    guestbook: CreateGuestbookDTO
  ): Promise<number> {
    return createGuestbook.execute(guestbook, collectionIdOrAlias)
  }

  getGuestbook(guestbookId: number): Promise<Guestbook> {
    return getGuestbook.execute(guestbookId).then((guestbook) => guestbook as Guestbook)
  }

  getGuestbooksByCollectionId(
    collectionIdOrAlias: number | string,
    includeStats = false,
    includeInherited = false
  ): Promise<Guestbook[]> {
    return getGuestbooksByCollectionId
      .execute(collectionIdOrAlias, includeStats, includeInherited)
      .then((guestbooks) => guestbooks as Guestbook[])
  }

  getGuestbookResponsesByGuestbookId(
    guestbookId: number,
    limit?: number,
    offset?: number
  ): Promise<GuestbookResponseSubset> {
    return getGuestbookResponsesByGuestbookId.execute(guestbookId, limit, offset)
  }

  setGuestbookEnabled(
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ): Promise<void> {
    return setGuestbookEnabled.execute(collectionIdOrAlias, guestbookId, enabled)
  }

  downloadGuestbookResponsesByCollectionId(collectionIdOrAlias: number | string): Promise<string> {
    return downloadGuestbookResponsesByCollectionId.execute(collectionIdOrAlias)
  }

  downloadGuestbookResponsesOfAGuestbook(
    dataverseId: number | string,
    guestbookId: number
  ): Promise<string> {
    return downloadGuestbookResponsesOfAGuestbook.execute(dataverseId, guestbookId)
  }

  assignDatasetGuestbook(datasetId: number | string, guestbookId: number): Promise<void> {
    return assignDatasetGuestbook.execute(datasetId, guestbookId)
  }

  removeDatasetGuestbook(datasetId: number | string): Promise<void> {
    return removeDatasetGuestbook.execute(datasetId)
  }
}
