import useSWR from 'swr'
import { postFetcher } from './utils'

export const useLazyRequest = (query: string, data) => {
  const response = useSWR(query, () => null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false,
  })

  const executeQuery = async extraData => {
    const result = await postFetcher(query, { ...data, ...extraData })
    response.mutate(result, false)
  }

  return { data: response.data ?? [], fetchMore: executeQuery }
}
