import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ParkFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  destinations: string[];
  destinationFilter: string;
  setDestinationFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortBy: 'name' | 'destination';
  setSortBy: (value: 'name' | 'destination') => void;
}

export default function ParkFilterModal({
  isOpen,
  onClose,
  onApply,
  onReset,
  destinations,
  destinationFilter,
  setDestinationFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy
}: ParkFilterModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-t-xl sm:rounded-xl bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                      Filter & Sort
                    </Dialog.Title>
                    
                    <div className="space-y-6">
                      {/* Sort Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSortBy('name')}
                            className={`px-4 py-2 text-sm rounded-lg border ${
                              sortBy === 'name'
                                ? 'bg-blue-50 border-blue-600 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            Name
                          </button>
                          <button
                            onClick={() => setSortBy('destination')}
                            className={`px-4 py-2 text-sm rounded-lg border ${
                              sortBy === 'destination'
                                ? 'bg-blue-50 border-blue-600 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-400'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            Destination
                          </button>
                        </div>
                      </div>

                      {/* Status Filter */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h4>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full p-1 border-gray-300 text-gray-700 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                          <option className='py-1' value="all">All Statuses</option>
                          <option className='py-1' value="OPERATING">Operating</option>
                          <option className='py-1' value="CLOSED">Closed</option>
                        </select>
                      </div>

                      {/* Destination Filter */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</h4>
                        <select
                          value={destinationFilter}
                          onChange={(e) => setDestinationFilter(e.target.value)}
                          className="w-full p-1 border-gray-300 text-gray-700 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                          <option className='py-1' value="all">All Destinations</option>
                          {destinations.map(dest => (
                            <option className='py-1' key={dest} value={dest}>{dest}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex justify-center rounded-lg bg-red-500 text-white border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-red-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-red-700"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={onApply}
                    className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Show Results
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}