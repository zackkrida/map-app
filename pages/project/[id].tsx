import Dialog from '@reach/dialog'
import { Project } from 'components/Project'
import { fetcher } from 'lib/utils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'

export default function ProjectPage() {
  const router = useRouter()
  const { id } = router.query
  const { data: project } = useSWR(`/api/project/${id}`, fetcher)

  useEffect(() => {
    router.prefetch('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog aria-labelledby="projectTitle" onDismiss={() => router.push('/')}>
      <Project project={project} />
    </Dialog>
  )
}
