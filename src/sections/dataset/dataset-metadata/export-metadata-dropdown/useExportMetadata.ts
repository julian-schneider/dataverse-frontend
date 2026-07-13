import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { DatasetNotNumberedVersion } from '@iqss/dataverse-client-javascript'
import { DatasetPublishingStatus, DatasetVersion } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { exportDatasetMetadata } from '@/dataset/domain/useCases/exportDatasetMetadata'

interface UseExportMetadataParams {
  datasetRepository: DatasetRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

interface UseExportMetadataReturn {
  handleExportMetadata: (exporter: string) => Promise<void>
}

export const useExportMetadata = ({
  datasetRepository,
  datasetPersistentId,
  datasetVersion
}: UseExportMetadataParams): UseExportMetadataReturn => {
  const { t } = useTranslation('shared')

  const handleExportMetadata = useCallback(
    async (exporter: string) => {
      const newWindow = window.open('', '_blank')

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        return
      }

      try {
        newWindow.document.title = t('exportMetadata')

        const version =
          datasetVersion.publishingStatus === DatasetPublishingStatus.DRAFT
            ? DatasetNotNumberedVersion.DRAFT
            : undefined
        const metadata = await exportDatasetMetadata(
          datasetRepository,
          datasetPersistentId,
          exporter,
          version
        )

        const blob = new Blob([metadata.content], { type: metadata.contentType })
        const url = URL.createObjectURL(blob)
        newWindow.location.href = url

        setTimeout(() => URL.revokeObjectURL(url), 1000)
      } catch {
        if (!newWindow.closed) newWindow.close()
        toast.error(t('exportMetadataError'))
      }
    },
    [datasetRepository, datasetPersistentId, datasetVersion.publishingStatus, t]
  )

  return { handleExportMetadata }
}
