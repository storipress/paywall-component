import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_STRIPE_PUBLISHABLEKEY: z.string().optional().default(''),
  },
  runtimeEnv: import.meta.env,
})
