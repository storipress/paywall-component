import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'

export function useSite() {
  const { result } = useQuery(gql`
    query SiteSubscriptionInfo {
      siteSubscriptionInfo {
        name
        email
        subscription
        monthly_price_id
        monthly_price
        yearly_price_id
        yearly_price
      }
    }
  `)

  const siteSubscriptionInfo = computed(() => {
    return result.value?.siteSubscriptionInfo ?? {}
  })

  return {
    siteSubscriptionInfo,
  }
}
