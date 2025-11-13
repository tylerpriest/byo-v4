// Main exports for Supabase integration
export {
  getSupabaseClient,
  resetSupabaseClient,
  getDemoModeStatus,
  setAdminDemoModeOverride,
  useDemoModeStatus,
  type DemoModeStatus,
} from './client'

export { DEMO_USER_ID, DEMO_ADMIN_ID, DEMO_ORG_ID } from './mock-client'

export type * from './types'
