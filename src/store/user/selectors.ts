import type { UserState } from './types'

export const selectUser = (state: UserState) => state.user
export const selectIsLoggedIn = (state: UserState) => state.user !== null
export const selectUserName = (state: UserState) => state.user?.name ?? '游客'
export const selectUserLoading = (state: UserState) => state.isLoading
export const selectUserError = (state: UserState) => state.error
