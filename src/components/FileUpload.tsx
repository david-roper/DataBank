'use client';

import React, { useState } from 'react';

import { Button } from '@douglasneuroinformatics/react-components';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface FileUploadProps extends React.ComponentPropsWithoutRef<'form'> {
  /** Specify the `name` attribute for the `HTMLInputElement` */
  inputName: string;
  description: string;
  /** The label to display for the button to submit the file */
  submitBtnLabel: string;
}

export const FileUpload = ({ className, description, inputName, submitBtnLabel, ...props }: FileUploadProps) => {
  const [filename, setFilename] = useState('');
  return (
    <form className={clsx('max-w-xs', className)} {...props}>
      <div className="flex w-full items-center justify-center">
        <label
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
          htmlFor="dropzone-file"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <CloudArrowUpIcon height={40} width={40} />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{filename}</p>
          </div>
        </label>
        <input
          className="hidden"
          id="dropzone-file"
          name={inputName}
          type="file"
          onChange={(e) => setFilename(e.target.files?.[0].name ?? '')}
        />
      </div>
      <Button className="mt-2 w-full" disabled={!filename} label={submitBtnLabel} />
    </form>
  );
};
