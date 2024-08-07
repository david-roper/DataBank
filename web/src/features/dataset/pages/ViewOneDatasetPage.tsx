/* eslint-disable perfectionist/sort-objects */
import React, { useEffect, useState } from 'react';

import type { DatasetViewPaginationDto, TabularDataset } from '@databank/types';
import { Button, Card, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useDownload, useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { type RouteObject, useNavigate, useParams } from 'react-router-dom';

import { LoadingFallback } from '@/components';
import { useAuthStore } from '@/stores/auth-store';

import { DatasetPagination } from '../components/DatasetPagination';
import DatasetTable from '../components/DatasetTable';

const ViewOneDatasetPage = () => {
  // location contains the variable in the state of the navigate function
  const navigate = useNavigate();
  const notifications = useNotificationsStore();
  const params = useParams();
  const [dataset, setDataset] = useState<TabularDataset | null>(null);
  const download = useDownload();
  const { currentUser } = useAuthStore();

  const [columnPaginationDto, setColumnPaginationDto] = useState<DatasetViewPaginationDto>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  });

  const [rowPaginationDto, setRowPaginationDto] = useState<DatasetViewPaginationDto>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 100
  });

  useEffect(() => {
    const fetchDataset = () => {
      axios
        .get<TabularDataset>(`/v1/datasets/${params.datasetId}`)
        .then((response) => {
          setDataset(response.data);
        })
        .catch(console.error);
    };
    void fetchDataset();
  }, [params.datasetId, rowPaginationDto, columnPaginationDto]);

  const isManager = !currentUser;

  const addManager = (managerIdToAdd: string) => {
    axios
      .patch(`/v1/datasets/managers/${params.datasetId}/${managerIdToAdd}`)
      .then(() => {
        notifications.addNotification({
          type: 'success',
          message: `User with Id ${managerIdToAdd} has been added to the current dataset`
        });
      })
      .catch(console.error);
  };

  const removeManager = (managerIdToRemove: string) => {
    axios
      .delete(`/v1/datasets/managers/${params.datasetId}/${managerIdToRemove}`)
      .then(() => {
        notifications.addNotification({
          type: 'success',
          message: `User with Id ${managerIdToRemove} has been removed from the dataset`
        });
        navigate('/portal/datasets');
      })
      .catch(console.error);
  };

  const deleteDataset = (datasetId: string) => {
    axios
      .delete(`/v1/datasets/${datasetId}`)
      .then(() => {
        notifications.addNotification({
          type: 'success',
          message: `Dataset with Id ${datasetId} has been deleted`
        });
        navigate('/portal/datasets');
      })
      .catch(console.error);
  };

  const handleDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const delimiter = format === 'CSV' ? ',' : '\t';
    const filename = data.name + '_' + new Date().toISOString() + format === 'CSV' ? '.csv' : '.tsv';

    let resultString = ''.concat(
      data.columns.join(delimiter),
      '\n',
      data.rows
        .map((row) => {
          Object.values(row).join(delimiter);
        })
        .join('\n')
    );

    void download(filename, resultString);
  };

  const handleMetaDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const delimiter = format === 'CSV' ? ',' : '\t';
    const filename = 'metadata_' + data.name + '_' + new Date().toISOString() + format === 'CSV' ? '.csv' : '.tsv';

    const metaDataHeader = [
      'column_name',
      'column_type',
      'nullable',
      'count',
      'nullCount',
      'max',
      'min',
      'mean',
      'median',
      'mode',
      'std',
      'distribution'
    ];

    const metadataRowsString = data.columns
      .map((columnName) => {
        [
          columnName,
          data.metadata[columnName]?.kind,
          data.metadata[columnName]?.nullable,
          data.metadata[columnName]?.summary.count,
          data.metadata[columnName]?.summary.nullCount,
          data.metadata[columnName]?.summary.max,
          data.metadata[columnName]?.summary.min,
          data.metadata[columnName]?.summary.mean,
          data.metadata[columnName]?.summary.median,
          data.metadata[columnName]?.summary.mode,
          data.metadata[columnName]?.summary.std,
          data.metadata[columnName]?.summary.distribution
        ].join(delimiter);
      })
      .join('\n');

    let resultString = ''.concat(metaDataHeader.join(delimiter), '\n', metadataRowsString);

    void download(filename, resultString);
  };

  return dataset ? (
    <>
      <Card>
        <Card.Header>
          <Card.Title>{dataset.name}</Card.Title>
          <Card.Description>{dataset.description}</Card.Description>
          {isManager && (
            <>
              <Button className="m-2" variant={'secondary'} onClick={() => addManager('managerIdToAdd')}>
                Add Manager
              </Button>

              <Button className="m-2" variant={'secondary'} onClick={() => removeManager('managerIdToRemove')}>
                Remove Manager
              </Button>

              <Button className="m-2" variant={'danger'} onClick={() => deleteDataset(dataset.id)}>
                Delete Dataset
              </Button>
            </>
          )}
        </Card.Header>
        <Card.Content>
          <DatasetPagination
            datasetPaginationDto={{
              currentPage: columnPaginationDto.currentPage,
              itemsPerPage: columnPaginationDto.itemsPerPage,
              totalItems: columnPaginationDto.totalItems
            }}
            setDatasetPagination={setColumnPaginationDto}
          />

          <DatasetTable
            columnIds={dataset.columnIds}
            columns={dataset.columns}
            createdAt={dataset.createdAt}
            datasetType={dataset.datasetType}
            description={dataset.description}
            id={dataset.id}
            isManager={isManager}
            isReadyToShare={dataset.isReadyToShare}
            license={dataset.license}
            managerIds={dataset.managerIds}
            metadata={dataset.metadata}
            name={dataset.name}
            permission={dataset.permission}
            primaryKeys={dataset.primaryKeys}
            rows={dataset.rows}
            updatedAt={dataset.updatedAt}
          />

          <DatasetPagination
            datasetPaginationDto={{
              currentPage: rowPaginationDto.currentPage,
              itemsPerPage: rowPaginationDto.itemsPerPage,
              totalItems: rowPaginationDto.totalItems
            }}
            setDatasetPagination={setRowPaginationDto}
          />
        </Card.Content>
        <Card.Footer>
          {isManager && (
            <>
              <Button
                className="m-2"
                variant={'primary'}
                onClick={() => {
                  return 'TODO';
                }}
              >
                Edit Dataset Information
              </Button>

              <Button
                className="m-2"
                variant={'primary'}
                onClick={() => {
                  return 'TODO';
                }}
              >
                Set Dataset Sharable
              </Button>

              <Button className="m-2" variant={'secondary'}>
                <DropdownMenu>
                  <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                    Download Dataset
                    <ChevronDownIcon className="size-[1rem]" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-48">
                    <DropdownMenu.Item onClick={() => handleDataDownload('TSV', dataset)}>
                      Download TSV
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => handleDataDownload('CSV', dataset)}>
                      Download CSV
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Button>

              <Button className="m-2" variant={'secondary'}>
                <DropdownMenu>
                  <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                    Download Metadata
                    <ChevronDownIcon className="size-[1rem]" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-48">
                    <DropdownMenu.Item onClick={() => handleMetaDataDownload('TSV', dataset)}>
                      Download TSV
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => handleMetaDataDownload('CSV', dataset)}>
                      Download CSV
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Button>
            </>
          )}
        </Card.Footer>
      </Card>
    </>
  ) : (
    <LoadingFallback />
  );
};

export const viewOneDatasetRoute: RouteObject = {
  path: 'dataset/:datasetId',
  element: <ViewOneDatasetPage />
};
