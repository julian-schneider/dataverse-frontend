import {
  DatasetNonNumericVersion,
  DatasetNonNumericVersionSearchParam,
  DatasetPublishingStatus,
  DatasetVersion
} from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { getDatasetVersionsSummaries } from '@/dataset/domain/useCases/getDatasetVersionsSummaries'
import {
  DatasetVersionSummaryInfo,
  DatasetVersionSummaryStringValues
} from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetVersionPaginationInfo } from '@/dataset/domain/models/DatasetVersionPaginationInfo'

export class DatasetHelper {
  static async canExportMetadata(
    datasetRepository: DatasetRepository,
    datasetId: number | string,
    datasetVersion: DatasetVersion,
    canUpdateDataset: boolean
  ): Promise<boolean> {
    if (datasetVersion.publishingStatus === DatasetPublishingStatus.DRAFT) {
      return canUpdateDataset
    }

    if (datasetVersion.publishingStatus !== DatasetPublishingStatus.RELEASED) {
      return false
    }

    return this.isLatestPublishedVersion(
      datasetRepository,
      datasetId,
      datasetVersion.number.toString()
    )
  }

  private static async isLatestPublishedVersion(
    datasetRepository: DatasetRepository,
    datasetId: number | string,
    datasetVersionNumber: string
  ): Promise<boolean> {
    try {
      const versionSummaries = await getDatasetVersionsSummaries(
        datasetRepository,
        datasetId,
        new DatasetVersionPaginationInfo(1, 10)
      )
      const latestPublishedVersion = versionSummaries.summaries.find((summary) =>
        this.isPublishedVersionSummary(summary)
      )

      return latestPublishedVersion?.versionNumber === datasetVersionNumber
    } catch {
      return false
    }
  }

  private static isPublishedVersionSummary(summary: DatasetVersionSummaryInfo): boolean {
    return (
      summary.versionNumber !== DatasetNonNumericVersion.DRAFT &&
      summary.versionNumber !== DatasetNonNumericVersionSearchParam.DRAFT &&
      summary.summary !== DatasetVersionSummaryStringValues.versionDeaccessioned
    )
  }
}
