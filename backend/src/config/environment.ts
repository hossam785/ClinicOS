import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export interface Environment {
  PORT: number
  NODE_ENV: string
}

function validateEnv(): Environment {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001
  const nodeEnv = process.env.NODE_ENV || 'development'

  if (isNaN(port)) {
    throw new Error('CONFIG_ERROR: Port configuration must be a valid number.')
  }

  return {
    PORT: port,
    NODE_ENV: nodeEnv,
  }
}

export const env = validateEnv()
