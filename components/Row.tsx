import React from 'react'
import { ProjectListItem } from '../components/ProjectListItem'

export function Row({ index, data, style, children }) {
  const item = data[index]

  return (
    <div style={style}>
      <ProjectListItem
        project={item.project}
        key={`legacy-${item.project.Id}`}
      />
      {children}
    </div>
  )
}
