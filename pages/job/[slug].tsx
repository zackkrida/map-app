import Dialog from '@reach/dialog'
import { Job } from 'components/Job'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function JobPage({ slug }) {
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog aria-labelledby="jobTitle" onDismiss={() => router.push('/')}>
      <Job />
    </Dialog>
  )
}

export function getStaticProps({ params: { slug } }) {
  return { props: { slug } }
}

export function getStaticPaths() {
  return {
    paths: [{ params: { slug: 'one' } }, { params: { slug: 'two' } }],
    fallback: false,
  }
}
