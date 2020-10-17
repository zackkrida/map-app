import Dialog from '@reach/dialog'
import React, { useState } from 'react'
import { StatusColorBg } from 'types/colors'

export function InfoModal() {
  const [showInfoModal, setShowInfoModal] = useState(false)
  function onDismiss() {
    setShowInfoModal(false)
  }

  return (
    <>
      <button
        onClick={() => setShowInfoModal(true)}
        className="appearance-none rounded-full p-1 absolute left-2 bottom-2 bg-brand-blue hover:bg-blue-500 text-white w-8 h-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <Dialog
        aria-label="Info Modal"
        isOpen={showInfoModal}
        onDismiss={onDismiss}
        className="info-modal"
      >
        <div className="text-center p-4 h-full flex flex-col justify-between items-center text-center flex-grow bg-white rounded shadow-md">
          <div className="w-28 h-28 mx-auto mb-8 opacity-75">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 64 645"
              className="w-full fill-current text-brand-navy mx-auto"
            >
              <path
                fill="#6EA663"
                d="M39.623 31.628H0v7.907h39.623v-7.907zM39.623 19.767H0v7.907h39.623v-7.907zM39.623 43.488H0v7.907h39.623v-7.907zM39.623 55.349H0v7.907h39.623v-7.907z"
              ></path>
              <path
                fill="#5C8AE6"
                d="M51.51 19.767h-7.925v19.768h7.924V19.768zM63.396 19.767h-7.924v19.768h7.924V19.768zM63.396 43.488h-7.924v19.768h7.924V43.488zM51.51 43.488h-7.925v19.768h7.924V43.488z"
              ></path>
              <path
                fill="#738799"
                d="M0 15.814h39.623L63.396 0H23.774L0 15.814z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-400 uppercase text-sm font-semibold">
            Welcome to the
          </p>
          <h1 className="text-lg md:text-2xl font-semibold">
            Marshall Project Map
          </h1>
          <p className="mt-4">
            Use the filters to search for ongoing and completed projects.
          </p>

          <h3 className="text-md font-bold mt-4">Marker Color Legend</h3>
          <ul className="mt-4 text-sm">
            {Object.entries(StatusColorBg).map(([key, value]) => (
              <li
                key={key}
                className="flex justify-between items-center gap-2 pb-2"
              >
                <span
                  className={`rounded-full block w-4 h-4 mr-4 border-opacity-75 border-2 ${value}`}
                ></span>
                {key}
              </li>
            ))}
          </ul>
        </div>
      </Dialog>
    </>
  )
}
