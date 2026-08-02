// Express Router for Offline AI Medical Assistant — Module-017

import { Router } from 'express'
import { AIAssistantController } from './aiAssistant.controller'

const aiAssistantRouter = Router()

aiAssistantRouter.post('/query', AIAssistantController.query)
aiAssistantRouter.get('/status', AIAssistantController.getStatus)
aiAssistantRouter.get('/sessions', AIAssistantController.listSessions)
aiAssistantRouter.post('/rebuild-index', AIAssistantController.rebuildIndex)

export { aiAssistantRouter }
