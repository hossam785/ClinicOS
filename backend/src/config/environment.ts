import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export interface Environment {
  PORT: number
  NODE_ENV: string
  DATABASE_URL: string
  DIRECT_URL: string
  PLATFORM_SUPER_ADMIN_EMAIL: string
  PLATFORM_SUPER_ADMIN_PASSWORD: string
}

function validateEnv(): Environment {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
  const nodeEnv = process.env.NODE_ENV || 'development'
  const databaseUrl = process.env.DATABASE_URL || ''
  const directUrl = process.env.DIRECT_URL || databaseUrl
  const platformSuperAdminEmail = process.env.PLATFORM_SUPER_ADMIN_EMAIL || 'ClinicOS@gmail.com'
  const platformSuperAdminPassword = process.env.PLATFORM_SUPER_ADMIN_PASSWORD || 'ClinicOS@2005C'

  if (isNaN(port)) {
    throw new Error('CONFIG_ERROR: Port configuration must be a valid number.')
  }

  return {
    PORT: port,
    NODE_ENV: nodeEnv,
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
    PLATFORM_SUPER_ADMIN_EMAIL: platformSuperAdminEmail,
    PLATFORM_SUPER_ADMIN_PASSWORD: platformSuperAdminPassword,
  }
}

export const env = validateEnv()
