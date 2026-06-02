import React, { createContext, useContext, useMemo } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { UserRepository } from '@/users/domain/repositories/UserRepository'

export interface RepositoriesContextValue {
  collectionRepository: CollectionRepository
  datasetRepository: DatasetRepository
  fileRepository: FileRepository
  userRepository: UserRepository
}

const RepositoriesContext = createContext<RepositoriesContextValue | undefined>(undefined)

interface RepositoriesProviderProps extends RepositoriesContextValue {
  children: React.ReactNode
}

export function RepositoriesProvider({
  children,
  collectionRepository,
  datasetRepository,
  fileRepository,
  userRepository
}: RepositoriesProviderProps) {
  const value = useMemo(
    () => ({
      collectionRepository,
      datasetRepository,
      fileRepository,
      userRepository
    }),
    [collectionRepository, datasetRepository, fileRepository, userRepository]
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

export function useUserRepositories() {
  const { userRepository } = useRepositories()

  return { userRepository }
}
