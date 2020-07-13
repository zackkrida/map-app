import Skeleton from 'react-loading-skeleton'
import { useRouter } from 'next/router'
import { getBrandColor, prettyDate } from 'lib/utils'
import { Logo } from './Logo'

export function Project({ project }) {
  const router = useRouter()
  const loading = typeof project === 'undefined'

  const show = value => (loading ? <Skeleton /> : value)

  return (
    <div className="bg-white shadow overflow-hidden shadow-md sm:rounded-lg w-full relative">
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 bg-brand-navy bg-opacity-50 rounded-full text-white cursor-pointer focus:outline-none"
      >
        <svg
          className="w-12 h-12 md:w-16 md:h-16 p-3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div>
        <div className="max-w-md mx-auto md:pb-0 md:pt-12 md:px-0 px-12 py-4">
          <Logo />
        </div>
        {/* <img
          className="h-80 w-full object-cover"
          src="/images/house-big.jpg"
          alt=""
        /> */}
      </div>

      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Job Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
          Details about the project.
        </p>
      </div>
      <div className="px-4 py-5 sm:p-0">
        <dl>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
            <dt className="text-sm leading-5 font-medium text-gray-500">
              Customer
            </dt>
            <dd
              id="jobTitle"
              className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2"
            >
              {show(project?.i360__Correspondence_Name__c)}
            </dd>
          </div>
          <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            <dt className="text-sm leading-5 font-medium text-gray-500">
              Address
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {show(
                <>
                  {project?.i360__Appointment_Address__c},{' '}
                  {project?.i360__Appointment_City__c},{' '}
                  {project?.i360__Appointment_State__c}{' '}
                  {project?.i360__Appointment_Zip__c}
                </>
              )}
            </dd>
          </div>
          <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            <dt className="text-sm leading-5 font-medium text-gray-500">
              Services Included
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {show(
                <div className="flex capitalize text-white mt-2 justify-start">
                  {project?.i360__Job_Type__c.split(';').map(i => (
                    <div
                      key={`${project.Id}-${i}`}
                      className={`mr-2 ${getBrandColor(
                        i
                      )} px-4 py-2 rounded-md`}
                    >
                      {i}
                    </div>
                  ))}
                </div>
              )}
            </dd>
          </div>
          <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            <dt className="text-sm leading-5 font-medium text-gray-500">
              Date Completed
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {show(
                project?.i360__Completed_On__c
                  ? prettyDate(project.i360__Completed_On__c)
                  : 'In Progress'
              )}
            </dd>
          </div>
          <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            <dt className="text-sm leading-5 font-medium text-gray-500">
              Sales Rep
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {show(project?.i360__Sale_Rep__c)}
            </dd>
          </div>
          <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            {/* <dt className="text-sm leading-5 font-medium text-gray-500">
              Attachments
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              <ul className="border border-gray-200 rounded-md">
                <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                  <div className="w-0 flex-1 flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 flex-1 w-0 truncate">
                      resume_back_end_developer.pdf
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                    >
                      Download
                    </a>
                  </div>
                </li>
                <li className="border-t border-gray-200 pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                  <div className="w-0 flex-1 flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 flex-1 w-0 truncate">
                      coverletter_back_end_developer.pdf
                    </span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href="#"
                      className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
                    >
                      Download
                    </a>
                  </div>
                </li>
              </ul>
            </dd> */}
          </div>
        </dl>
      </div>
    </div>
  )
}
