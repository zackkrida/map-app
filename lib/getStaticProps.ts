import { GetStaticProps } from 'next'
import { getProjects } from 'pages/api/project'

export const getStaticProps: GetStaticProps = async context => {
  let initialProjects = []

  try {
    const params = {
      q: '',
      type: 'zipCode',
    }
    initialProjects = await getProjects(params)
  } catch (error) {
    console.error(error)
  }

  console.info(`Initial project count ${initialProjects.length}`)

  return {
    props: { initialProjects },
    revalidate: 60 * 2,
  }
}
