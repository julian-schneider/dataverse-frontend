import {
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus
} from '@/dataset/domain/models/Dataset'
import type { Dataset } from '@/dataset/domain/models/Dataset'
import { QueryParamKey, Route } from '@/sections/Route.enum'

export class EditDatasetTermsHelper {
  static EDIT_DATASET_TERMS_TABS_KEYS = {
    datasetTerms: 'datasetTerms',
    restrictedFilesTerms: 'restrictedFilesTerms',
    guestbook: 'guestbook'
  } as const

  static EDIT_DATASET_TERMS_TAB_QUERY_KEY = 'tab'

  public static defineSelectedTabKey(searchParams: URLSearchParams): EditDatasetTermsTabKey {
    const tabValue = searchParams.get(this.EDIT_DATASET_TERMS_TAB_QUERY_KEY)

    return (
      this.EDIT_DATASET_TERMS_TABS_KEYS[
        tabValue as keyof typeof this.EDIT_DATASET_TERMS_TABS_KEYS
      ] ?? this.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms
    )
  }

  public static buildDatasetPageUrl(
    dataset: Dataset,
    version: EditDatasetTermsDatasetPageVersion = 'current'
  ): string {
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

    if (version === 'draft' || dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    } else {
      searchParams.set(QueryParamKey.VERSION, dataset.version.number.toString())
    }

    return `${Route.DATASETS}?${searchParams.toString()}`
  }
}

export type EditDatasetTermsTabKey =
  (typeof EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS)[keyof typeof EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS]

export type EditDatasetTermsDatasetPageVersion = 'current' | 'draft'
