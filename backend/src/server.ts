import { app } from './app'
import { env } from '@/config/environment'

const PORT = env.PORT

// Start server
const server = app.listen(PORT, () => {
  console.info(`[ClinicOS Backend] Server running on http://localhost:${PORT} in ${env.NODE_ENV} mode`)
})

export { app, server }
