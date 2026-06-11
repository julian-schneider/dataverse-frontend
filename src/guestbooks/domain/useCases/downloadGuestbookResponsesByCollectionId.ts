import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function downloadGuestbookResponsesByCollectionId(
  guestbookRepository: GuestbookRepository,
  collectionIdOrAlias: number | string
): Promise<string> {
  return guestbookRepository.downloadGuestbookResponsesByCollectionId(collectionIdOrAlias)
}
