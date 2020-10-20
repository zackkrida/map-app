import React, { useEffect, useMemo, createRef } from 'react'
import { FixedSizeList } from 'react-window'
import { Row } from './Row'
import useDimensions from 'react-cool-dimensions'
import { useMediaQuery } from '../lib/useMediaQuery'

export function ProjectList({
  projects,
  activeItem,
  setActiveItem,
}: ProjectListProps) {
  const listRef = createRef<FixedSizeList>()
  const {
    ref: listWrapperRef,
    width: listWrapperWidth,
    height: listWrapperHeight,
  } = useDimensions<HTMLDivElement>({})
  const isLarge = useMediaQuery('(min-width: 768px')
  const projectItemData = useMemo(() => {
    return projects.map(project => ({ project }))
  }, [projects])

  useEffect(() => {
    if (!activeItem || !listRef.current) return
    let activeProject = projects.findIndex(i => i.Id === activeItem)
    listRef.current.scrollToItem(activeProject, 'center')
  }, [activeItem])

  return (
    <div
      ref={listWrapperRef}
      className="md:overflow-y-scroll md:flex-grow block"
    >
      {projects.length > 0 && (
        <ul className="flex md:block overflow-x-scroll md:overflow-auto">
          <FixedSizeList
            ref={listRef}
            itemCount={projects.length}
            itemSize={isLarge ? 135 : 320}
            layout={isLarge ? 'vertical' : 'horizontal'}
            itemData={projectItemData}
            width={listWrapperWidth}
            height={isLarge ? listWrapperHeight : 135}
          >
            {Row({ activeItem, setActiveItem })}
          </FixedSizeList>
        </ul>
      )}
    </div>
  )
}

interface ProjectListProps {
  projects: Project[]
  activeItem: string | undefined
  setActiveItem: (ProjectId: Project['Id']) => void
}
