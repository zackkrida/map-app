import Skeleton from 'react-loading-skeleton'
import { useRouter } from 'next/router'
import { getAddressString, getBrandColor, prettyDate } from 'lib/utils'
import { Logo } from './Logo'
import { ExtendedProject, ExtendedProjectResult } from 'types/types'

export function Project({ project }: { project: ExtendedProjectResult }) {
  const router = useRouter()
  const loading = typeof project === 'undefined'
  const isLegacy = project?.legacy === true
  const show = value => (loading ? <Skeleton /> : value)

  const hasProducts = isLegacy
    ? false
    : (project as ExtendedProject)?.Roofing_Product_Color__c ||
      (project as ExtendedProject)?.Siding_Product_Color__c ||
      (project as ExtendedProject)?.Trim_Color__c

  return (
    <div className="bg-white overflow-hidden shadow-md sm:rounded-lg w-full relative">
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 rounded-full text-white cursor-pointer focus:outline-none focus:shadow-outline-blue"
      >
        <svg
          className="w-12 h-12 md:w-14 md:h-14 p-2 text-brand-gray"
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
              {show(project && getAddressString(project))}
            </dd>
          </div>
          {!isLegacy && (
            <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
              <dt className="text-sm leading-5 font-medium text-gray-500">
                Services Included
              </dt>
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {show(
                  <div className="flex capitalize text-white mt-2 justify-start">
                    {(project as ExtendedProject)?.i360__Job_Type__c
                      .split(';')
                      .map(i => (
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
          )}
          <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            <dt className="text-sm leading-5 font-medium text-gray-500">
              Date Completed
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {show(
                (
                  project?.legacy === true
                    ? project?.Legacy_Sold_On_Date__c
                    : project?.i360__Completed_On__c
                )
                  ? prettyDate(
                      project?.legacy === true
                        ? project?.Legacy_Sold_On_Date__c
                        : project?.i360__Completed_On__c
                    )
                  : 'In Progress'
              )}
            </dd>
          </div>
          <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            <dt className="text-sm leading-5 font-medium text-gray-500">
              Sales Rep
            </dt>
            <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {show(
                project?.legacy === true
                  ? project.Sales_Rep__c
                  : project?.i360__Sale_Rep__c
              )}
            </dd>
          </div>
          <div className="mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5">
            <dt className="text-sm leading-5 font-medium text-gray-500 mb-4 md:mb-0">
              Products
            </dt>
            {loading ? (
              <Skeleton />
            ) : (
              <dd className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
                {!hasProducts && (
                  <p className="text-gray-500">
                    No product information avaliable.
                  </p>
                )}
                {hasProducts && (
                  <ul className="border border-gray-200 rounded-md">
                    {(project as ExtendedProject)?.Roofing_Product_Color__c && (
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                        <div className="w-0 flex-1 md:flex items-center">
                          <h2 className="font-bold md:w-32 text-gray-500">
                            Roofing Color
                          </h2>
                          <span className="md:ml-2 flex-1 w-0 truncate">
                            {show(
                              (project as ExtendedProject)
                                ?.Roofing_Product_Color__c
                            )}
                          </span>
                        </div>
                      </li>
                    )}
                    {(project as ExtendedProject)?.Siding_Product_Color__c && (
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                        <div className="w-0 flex-1 md:flex items-center">
                          <h2 className="font-bold md:w-32 text-gray-500">
                            Siding Color
                          </h2>
                          <span className="md:ml-2 flex-1 w-0 truncate">
                            {show(
                              (project as ExtendedProject)
                                ?.Siding_Product_Color__c
                            )}
                          </span>
                        </div>
                      </li>
                    )}
                    {(project as ExtendedProject)?.Trim_Color__c && (
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
                        <div className="w-0 flex-1 md:flex items-center">
                          <h2 className="font-bold md:w-32 text-gray-500">
                            Windows Color
                          </h2>
                          <span className="md:ml-2 flex-1 w-0 truncate">
                            {show((project as ExtendedProject)?.Trim_Color__c)}
                          </span>
                        </div>
                      </li>
                    )}
                  </ul>
                )}
              </dd>
            )}
          </div>
        </dl>
      </div>
      <div className="mt-8 sm:mt-0 flex sm:gap-4 sm:px-6 sm:py-5">
        {/* <dt className="text-sm leading-5 font-medium text-gray-500">
          360 Info
        </dt> */}
        <dd className="ml-auto mt-1 text-sm leading-5 text-gray-900 sm:mt-0 mb-4 sm:mb-0 mr-4 sm:mr-0">
          <a
            className="px-4 py-2 bg-brand-orange rounded-sm text-white inline-flex focus:outline-none focus:shadow-outline-orange   "
            target="_blank"
            rel="noopener noreferrer"
            href={`https://improveit360-3562.cloudforce.com/${project?.Id}`}
          >
            View in 360
            <svg
              className="w-4 h-4 ml-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </dd>
      </div>
    </div>
  )
}
