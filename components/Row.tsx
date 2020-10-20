import React from 'react'
import { ProjectListItem } from '../components/ProjectListItem'

export const Row = ({
  activeItem,
  setActiveItem,
}: {
  activeItem: string
  setActiveItem: (ProjectId: Project['Id']) => void
}) => ({ index, data, style, children }) => {
  const item = data[index]

  return (
    <div style={style}>
      <ProjectListItem
        onClick={() => {
          setActiveItem(item.project.Id)
        }}
        activeItem={activeItem}
        project={item.project}
        key={`legacy-${item.project.Id}`}
      />
      {children}
    </div>
  )
}
