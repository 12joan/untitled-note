import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '~/lib/appContext';
import { overviewPath } from '~/lib/routes';
import { BackButton } from '~/components/BackButton';
import ReplaceIcon from '~/components/icons/ReplaceIcon';
import SearchIcon from '~/components/icons/SearchIcon';

export const SearchView = memo(() => {
  const project = useAppContext('project');

  if (!import.meta.env.DEV)
    return <Navigate to={overviewPath({ projectId: project.id })} />;

  return (
    <div className="lg:narrow grow flex flex-col gap-5">
      <div className="space-y-3">
        <BackButton />
        <h1 className="h1 select-none">Search {project.name}</h1>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-input focus-within:focus-ring flex py-0 pr-0 items-center rounded-b-none dark:!border-b-plain-700">
            <SearchIcon
              size="1.25em"
              noAriaLabel
              className="text-plain-500 dark:text-plain-400"
            />

            <input
              type="text"
              className="no-focus-ring grow bg-transparent px-3 py-2"
              placeholder="Search"
              aria-label="Search"
            />
          </div>

          <div className="text-input focus-within:focus-ring flex py-0 pr-0 items-center rounded-t-none !border-t-0">
            <ReplaceIcon
              size="1.25em"
              noAriaLabel
              className="text-plain-500 dark:text-plain-400"
            />

            <input
              type="text"
              className="no-focus-ring grow bg-transparent px-3 py-2"
              placeholder="Replace"
              aria-label="Replace"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <label className="flex gap-2 items-start">
            <input type="checkbox" checked />

            <span className="select-none">Find and replace</span>
          </label>

          <label className="flex gap-2 items-start">
            <input type="checkbox" />

            <span className="select-none">Whole words</span>
          </label>

          <label className="flex gap-2 items-start">
            <input type="checkbox" />

            <span className="select-none">Starts with</span>
          </label>

          <label className="flex gap-2 items-start">
            <input type="checkbox" />

            <span className="select-none">Match case</span>
          </label>

          <label className="flex gap-2 items-start">
            <input type="checkbox" />

            <span className="select-none">Preserve case</span>
          </label>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-rect btn-primary w-fit flex gap-2 items-center"
      >
        <ReplaceIcon size="1.25em" noAriaLabel />
        Replace 7 selected matches
      </button>

      <div className="space-y-3">
        <h2 className="h2 select-none">7 matches in 3 documents</h2>

        <button type="button" className="btn btn-link font-medium">
          Select all
        </button>

        <ul>
          <li>
            <label className="flex gap-3 items-center">
              <input
                type="checkbox"
                className="!rounded-full !size-8 bg-[length:75%]"
              />

              <div className="grow border rounded-lg p-4 space-y-1 select-none">
                {' '}
                {/* select-none only when selecting */}
                <strong className="block text-lg font-medium">
                  My First Document
                </strong>
                <p className="text-plain-500 dark:text-plain-400">
                  Ut tempora illum et facere voluptas{' '}
                  <mark className="bg-transparent text-ui font-semibold">
                    banana milkshake
                  </mark>{' '}
                  at. Aut impedit tenetur modi voluptas provident.
                </p>
                <button type="button" className="btn btn-link font-medium">
                  Show 2 other matches
                </button>
              </div>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
});
