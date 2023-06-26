import { useCallback, useState } from 'react';

import { DatasetColumnType } from '@databank/types';
import { Button, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { AnimatePresence, motion } from 'framer-motion';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';
import { Simplify } from 'type-fest';
import { ZodError, z } from 'zod';

import { Dropzone } from './Dropzone';

import { SuspenseFallback } from '@/components';
import { AnimatedCheckIcon } from '@/components/AnimatedCheckIcon';

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function formatFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
}

const parsedDataSchema = z.object({
  fields: z.string().array(),
  data: z.record(z.union([z.coerce.number(), z.string()])).array()
});

export type InferredColumn = { name: string; type: DatasetColumnType | null };

export type DropzoneResult = Simplify<{
  columns: InferredColumn[];
  data: Record<string, string | number>[];
}>;

export interface DatasetDropzoneProps {
  /** The maximum file size in bytes (default = 10MB) */
  maxFileSize?: number;

  /** Callback to be invoked when the file has been successfully parsed */
  onSubmit: (result: DropzoneResult) => void;
}

export const DatasetDropzone = ({ maxFileSize = 10485760, onSubmit }: DatasetDropzoneProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DropzoneResult | { isProcessing: boolean } | null>(null);
  const notifications = useNotificationsStore();
  const { t } = useTranslation();

  /** Function to validate the structure of the parsed data and infer types */
  const validate = useCallback(async (parsedData: unknown) => {
    const inferType = (currentType: DatasetColumnType | null, value: string | number): DatasetColumnType => {
      if (typeof value === 'string' || currentType === 'STRING') {
        return 'STRING';
      } else if (Number.isInteger(value)) {
        return currentType === 'FLOAT' ? 'FLOAT' : 'INTEGER';
      } else if (Number.isFinite(value)) {
        return 'FLOAT';
      }
      throw new Error(t('unexpectedValue', { value }));
    };

    const { fields, data } = await parsedDataSchema.parseAsync(parsedData);
    const columns: InferredColumn[] = fields.map((name) => ({ name, type: null }));
    for (let i = 0; i < fields.length; i++) {
      const columnName = fields[i];
      const column = columns.find(({ name }) => name === columnName)!;
      for (let j = 0; j < data.length; j++) {
        const value = data[j][columnName];
        column.type = inferType(column.type, value);
        if (column.type === 'STRING') {
          break;
        }
      }
    }
    return { columns, data };
  }, []);

  // If error, promise will reject with error containing internationalized message and details will be logged to stdout
  const parseCSV = useCallback(
    (file: File): Promise<{ fields: string[]; data: unknown[] }> =>
      new Promise((resolve, reject) => {
        if (!file) {
          console.error('File object must be defined');
          reject(new Error(t('unexpectedError')));
        } else if (file.size > maxFileSize) {
          reject(
            new Error(
              t('maxFileSizeError', { actualSize: formatFileSize(file.size), maxSize: formatFileSize(maxFileSize) })
            )
          );
        }
        Papa.parse(file, {
          complete(results) {
            if (results.errors.length > 0) {
              console.error(results.errors);
              reject(new Error(t('fileParseError')));
            } else if (!results.meta.fields) {
              console.error('Fields is undefined');
              reject(new Error(t('unexpectedError')));
            } else {
              resolve({ fields: results.meta.fields, data: results.data });
            }
          },
          error: (error) => {
            console.error(error);
            reject(t('unexpectedError'));
          },
          header: true,
          skipEmptyLines: true,
          transformHeader(header, index) {
            if (header === '') {
              reject(new Error(t('invalidEmptyColumnError', { index })));
            } else if (!/^[\w.-]+$/.test(header)) {
              reject(new Error(t('invalidColumnNameError', { columnName: header })));
            }
            return header.toUpperCase();
          }
        });
      }),
    [notifications]
  );

  const handleSubmit = useCallback(async (file: File) => {
    try {
      setResult({ isProcessing: true });
      const parsedData = await parseCSV(file);
      const result = await validate(parsedData);
      setResult(result);
    } catch (error) {
      console.error(error);
      setFile(null);
      setResult(null);
      if (error instanceof ZodError) {
        console.error(error.format());
        notifications.addNotification({ type: 'error', message: t('unexpectedError') });
      } else if (error instanceof Error) {
        notifications.addNotification({ type: 'error', message: error.message });
      } else {
        notifications.addNotification({ type: 'error', message: t('unexpectedError') });
      }
    }
  }, []);

  return (
    <div className="w-full sm:max-w-md">
      <div className="h-64 cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300">
        <AnimatePresence initial={false} mode="wait">
          {match(result)
            .with(P.nullish, () => <Dropzone file={file} setFile={setFile} />)
            .with({ isProcessing: P.boolean }, () => (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex h-full items-center justify-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="processing"
              >
                <SuspenseFallback />
              </motion.div>
            ))
            .with({ columns: P.any, data: P.any }, (result) => (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex h-full items-center justify-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="complete"
              >
                <AnimatedCheckIcon
                  className="h-12 w-12"
                  onComplete={() => {
                    onSubmit(result);
                  }}
                />
              </motion.div>
            ))
            .exhaustive()}
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <Button
          className="mt-2 w-full"
          disabled={!file}
          label={t('submit')}
          type="button"
          onClick={() => handleSubmit(file!)}
        />
        <Button
          className="mt-2 w-full"
          disabled={!file}
          label={t('reset')}
          type="button"
          variant="secondary"
          onClick={() => {
            setFile(null);
            setResult(null);
          }}
        />
      </div>
    </div>
  );
};
