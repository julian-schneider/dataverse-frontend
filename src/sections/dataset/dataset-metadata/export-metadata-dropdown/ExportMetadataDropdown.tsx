import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useGetAvailableDatasetMetadataExportFormats } from '@/info/domain/hooks/useGetAvailableDatasetMetadataExportFormats'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { DatasetHelper } from '@/sections/dataset/DatasetHelper'
import { useExportMetadata } from '@/sections/dataset/dataset-metadata/export-metadata-dropdown/useExportMetadata'

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
  const { handleExportMetadata } = useExportMetadata({
    datasetRepository,
    datasetPersistentId,
    datasetVersion
  })

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
