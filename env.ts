import {z} from 'zod'

const port = z.coerce.number().positive().int().max(65353)
const url = z.string().url()
const required = z.string().nonempty()

const envVariables = z.object({
  GOOGLE_CLIENT_ID: required,
  GOOGLE_CLIENT_SECRET: required,
  NEXTAUTH_SECRET: required,
  APP_PORT: port,
  NEXTAUTH_URL: url,
  POSTGRES_USER: required,
  POSTGRES_PASSWORD: required,
  POSTGRES_DB: required,
  POSTGRES_PORT: port,
  DATABASE_URL: url
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

const validateEnvVars = () => envVariables.parse(process.env)

export default validateEnvVars
