import Dialog from '@reach/dialog'
import { Project } from 'components/Project'
import { fetcher } from 'lib/utils'
import { useRouter } from 'next/router'
import useSWR from 'swr'

export default function LegacyProjectPage() {
  const router = useRouter()
  const { id } = router.query
  const { data: project } = useSWR(`/api/legacy/${id}`, fetcher)

  return (
    <Dialog aria-labelledby="projectTitle" onDismiss={() => router.back()}>
      <Project project={project} />
    </Dialog>
  )
}
