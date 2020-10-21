import Link from 'next/link'
import { getBrandColor, prettyDate } from 'lib/utils'
import { ReactEventHandler } from 'react'

export function ProjectListItem({
  onClick,
  activeItem,
  project,
}: {
  onClick: ReactEventHandler<HTMLDivElement>
  activeItem: string
  project: Project | LegacyProject
}) {
  const isLegacy = project.legacy === true
  const isActive = activeItem === project.Id
  const activeClass = `bg-blue-100 md:border md:border-blue-500 shadow-md hover:bg-blue-200 md:rounded-md`
  let className = `block hover:bg-blue-50 focus:outline-none focus:bg-blue-50 transition duration-150 ease-in-out border-r border-gray-100 flex flex-col justify-center md:border-b md:border-gray-50 w-80 md:w-full`

  if (isActive) {
    className = `${className} ${activeClass}`
  }

  let Wrapper = ({ children }) => (
    <div
      style={{ height: '135px' }}
      data-index={project.Id}
      className={className}
    >
      {children}
    </div>
  )

  if (!isLegacy) {
    Wrapper = ({ children }) => (
      <Link
        href={`/project/[id]`}
        as={`/project/${project.Id}`}
        prefetch={false}
      >
        <a data-index={project.Id} className={className}>
          {children}
        </a>
      </Link>
    )
  }

  return (
    <Wrapper>
      <div className="flex items-center px-2 md:px-4 py-4" onClick={onClick}>
        <div className="min-w-0 flex-1 flex items-center">
          {/* <div className="flex-shrink-0">
              <img
                className="h-12 w-12 rounded-full"
                src="/images/house.jpg"
                alt=""
              />
            </div> */}
          <div className="min-w-0 flex-1 pl-2 md:px-4">
            <div>
              <div className="text-sm leading-5 font-medium text-blue-600 truncate">
                {project.i360__Correspondence_Name__c}
              </div>
              <div className="flex flex-col">
                {project.legacy === false &&
                  project.i360__Appointment_Address__c && (
                    <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      <span className="truncate">
                        {project?.i360__Appointment_Address__c || ''},{' '}
                        {project?.i360__Appointment_City__c || ''},{' '}
                        {project?.i360__Appointment_State__c || ''}{' '}
                        {project?.i360__Appointment_Zip__c || ''}
                      </span>
                    </div>
                  )}
                {'i360__Completed_On__c' in project && (
                  <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="truncate">
                      {project.i360__Completed_On__c
                        ? `Completed ${prettyDate(
                            project.i360__Completed_On__c
                          )}`
                        : 'In Progress'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {project.legacy === true && (
              <div className="text-sm text-gray-400">
                <p>
                  Legacy Project: {prettyDate(project.Legacy_Sold_On_Date__c)}
                </p>
              </div>
            )}

            {project.legacy === false && (
              <div className="flex text-xs capitalize text-white mt-2 justify-start">
                {project?.i360__Job_Type__c?.split(';')?.map(i => (
                  <div
                    key={`${project.Id}-${i}`}
                    className={`mr-1 ${getBrandColor(i)} px-2 rounded-md`}
                  >
                    {i}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </Wrapper>
  )
}
