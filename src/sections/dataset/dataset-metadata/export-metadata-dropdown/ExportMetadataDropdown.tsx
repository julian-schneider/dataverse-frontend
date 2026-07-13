import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { toast } from 'react-toastify'
import { useGetAvailableDatasetMetadataExportFormats } from '@/info/domain/hooks/useGetAvailableDatasetMetadataExportFormats'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { exportDatasetMetadata } from '@/dataset/domain/useCases/exportDatasetMetadata'
import { DatasetPublishingStatus, DatasetVersion } from '@/dataset/domain/models/Dataset'
import { DatasetNotNumberedVersion } from '@iqss/dataverse-client-javascript'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { DatasetHelper } from '@/sections/dataset/DatasetHelper'

interface ExportMetadataDropdownProps {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  canUpdateDataset: boolean
  anonymizedView: boolean
  dataverseInfoRepository: DataverseInfoRepository
}

export const ExportMetadataDropdown = ({
  datasetPersistentId,
  datasetVersion,
  canUpdateDataset,
  anonymizedView,
  dataverseInfoRepository
}: ExportMetadataDropdownProps) => {
  const { datasetRepository } = useDatasetRepositories()
  const { t } = useTranslation('shared')
  const [shouldRender, setShouldRender] = useState(false)
  const { datasetMetadataExportFormats, isLoadingExportFormats, errorGetExportFormats } =
    useGetAvailableDatasetMetadataExportFormats({ dataverseInfoRepository })

  const datasetIsDraft = datasetVersion.publishingStatus === DatasetPublishingStatus.DRAFT

  useEffect(() => {
    let isMounted = true
    setShouldRender(false)

    if (anonymizedView) {
      return () => {
        isMounted = false
      }
    }

    void DatasetHelper.canExportMetadata(
      datasetRepository,
      datasetPersistentId,
      datasetVersion,
      canUpdateDataset
    ).then((canExportMetadata) => {
      if (isMounted) {
        setShouldRender(canExportMetadata)
      }
    })

    return () => {
      isMounted = false
    }
  }, [datasetRepository, datasetPersistentId, datasetVersion, canUpdateDataset, anonymizedView])

  if (!shouldRender) return null

  if (
    isLoadingExportFormats ||
    errorGetExportFormats ||
    !datasetMetadataExportFormats ||
    Object.keys(datasetMetadataExportFormats).length === 0
  ) {
    return null
  }

  const handleExportMetadata = async (exporter: string) => {
    const newWindow = window.open('', '_blank')

    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      return
    }

    try {
      newWindow.document.title = t('exportMetadata')

      const version = datasetIsDraft ? DatasetNotNumberedVersion.DRAFT : undefined
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
  }

  return (
    <DropdownButton
      id="export-metadata-dropdown"
      title={t('exportMetadata')}
      size="sm"
      icon={<BoxArrowUpRight className="me-2 mb-1" />}>
      {Object.entries(datasetMetadataExportFormats).map(([key, exportFormat]) => {
        if (!exportFormat.isVisibleInUserInterface) return null

        return (
          <DropdownButtonItem
            as="button"
            type="button"
            onClick={() => handleExportMetadata(key)}
            key={key}>
            {exportFormat.displayName}
          </DropdownButtonItem>
        )
      })}
    </DropdownButton>
  )
}
