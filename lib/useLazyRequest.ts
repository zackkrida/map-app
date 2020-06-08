import useSWR from 'swr'
import { postFetcher } from './utils'

export const useLazyRequest = (query: string, data) => {
  const response = useSWR(query, () => null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false,
  })

  const executeQuery = async () => {
    const result = await postFetcher(query, data)
    response.mutate(result, false)
  }

  return { data: response.data ?? [], fetchMore: executeQuery }
}
