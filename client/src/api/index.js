// Components use this module so mock and database-backed runs share one API.
// Mock mode stays the default until VITE_USE_MOCK_API is set to false.

import * as mockApi from './mockApi.js'
import * as httpApi from './httpApi.js'

export const USING_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const implementation = USING_MOCK_API ? mockApi : httpApi

export const {
  signup,
  login,
  getGarden,
  saveGarden,
} = implementation
