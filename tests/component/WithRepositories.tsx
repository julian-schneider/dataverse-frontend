import { ReactNode } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

function failFastRepository<T>(name: string): T {
  return new Proxy({} as object, {
    get(_target, prop) {
      if (typeof prop === 'symbol') return undefined
      return () => {
        throw new Error(
          `[${name}] method "${String(prop)}" was called but no repository was provided. ` +
            `Pass a ${name} explicitly to <WithRepositories /> in this test.`
        )
      }
    }
  }) as T
}

interface WithRepositoriesProps {
  children: ReactNode
  collectionRepository?: CollectionRepository
  datasetRepository?: DatasetRepository
  fileRepository?: FileRepository
}

export function WithRepositories({
  children,
  collectionRepository = failFastRepository<CollectionRepository>('CollectionRepository'),
  datasetRepository = failFastRepository<DatasetRepository>('DatasetRepository'),
  fileRepository = failFastRepository<FileRepository>('FileRepository')
}: WithRepositoriesProps) {
  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}
      fileRepository={fileRepository}>
      {children}
    </RepositoriesProvider>
  )
}
