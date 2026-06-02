import React, { createContext, useContext, useMemo } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

export interface RepositoriesContextValue {
  collectionRepository: CollectionRepository
  datasetRepository: DatasetRepository
  fileRepository: FileRepository
}

const RepositoriesContext = createContext<RepositoriesContextValue | undefined>(undefined)

interface RepositoriesProviderProps extends RepositoriesContextValue {
  children: React.ReactNode
}

export function RepositoriesProvider({
  children,
  collectionRepository,
  datasetRepository,
  fileRepository
}: RepositoriesProviderProps) {
  const value = useMemo(
    () => ({
      collectionRepository,
      datasetRepository,
      fileRepository
    }),
    [collectionRepository, datasetRepository, fileRepository]
  )

  return <RepositoriesContext.Provider value={value}>{children}</RepositoriesContext.Provider>
}

export function useRepositories() {
  const context = useContext(RepositoriesContext)

  if (!context) {
    throw new Error('useRepositories must be used within a RepositoriesProvider')
  }

  return context
}

export function useCollectionRepositories() {
  const { collectionRepository } = useRepositories()

  return { collectionRepository }
}

export function useDatasetRepositories() {
  const { datasetRepository, fileRepository } = useRepositories()

  return { datasetRepository, fileRepository }
}

export function useFileRepositories() {
  const { fileRepository } = useRepositories()

  return { fileRepository }
}
