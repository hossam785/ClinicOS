// Offline AI Medical Assistant REST / IPC Client Service — Module-017

import type {
  AIServerStatus,
  IAISession,
  IAIQueryRequest,
  IAIQueryResponse,
  AIQuickCommand,
} from '../types/aiAssistant.types'

class AIAssistantApiService {
  private mockStatus: AIServerStatus = {
    status: 'READY',
    modelName: 'Local Clinical Llama 3B',
    modelFormat: 'GGUF Q4_K_M (Offline)',
    isOffline: true,
    indexSyncPercentage: 100,
    lastIndexUpdate: new Date().toISOString(),
    activeUserRole: 'DOCTOR',
  }

  private mockQuickCommands: AIQuickCommand[] = [
    {
      id: 'cmd_01',
      title: 'Open Patient',
      description: 'Search & open patient profile by name, phone, or MRN.',
      category: 'PATIENT',
      prompt: 'Open patient Ahmed Ali',
      iconName: 'UserSearch',
    },
    {
      id: 'cmd_02',
      title: 'Patient Summary',
      description: 'Aggregate chronic diseases, allergies, meds, & recent visits.',
      category: 'CLINICAL',
      prompt: 'Summarize clinical history for current patient',
      iconName: 'FileText',
    },
    {
      id: 'cmd_03',
      title: 'Today\'s Appointments',
      description: 'Query today\'s scheduled appointments roster and queue.',
      category: 'NAVIGATION',
      prompt: 'Show today\'s appointment roster',
      iconName: 'Calendar',
    },
    {
      id: 'cmd_04',
      title: 'Search Attachments',
      description: 'Search lab results, radiology, and consent documents.',
      category: 'CLINICAL',
      prompt: 'Search blood test reports and lab attachments',
      iconName: 'Paperclip',
    },
    {
      id: 'cmd_05',
      title: 'Open Reports',
      description: 'View clinic revenue, patient growth, and operational metrics.',
      category: 'REPORTS',
      prompt: 'Show today\'s clinic revenue report',
      iconName: 'BarChart3',
    },
    {
      id: 'cmd_06',
      title: 'Visit Timeline',
      description: 'Display chronological visit history and recurring complaints.',
      category: 'CLINICAL',
      prompt: 'Show visit history timeline',
      iconName: 'Clock',
    },
    {
      id: 'cmd_07',
      title: 'Recent Prescriptions',
      description: 'Review active and historic medication regimens.',
      category: 'CLINICAL',
      prompt: 'Show previous prescriptions and active medications',
      iconName: 'Pill',
    },
    {
      id: 'cmd_08',
      title: 'Show Allergies',
      description: 'Check documented drug sensitivities and medical alerts.',
      category: 'CLINICAL',
      prompt: 'List documented allergies and adverse reactions',
      iconName: 'AlertTriangle',
    },
  ]

  async getServerStatus(): Promise<AIServerStatus> {
    return Promise.resolve({ ...this.mockStatus })
  }

  async getQuickCommands(): Promise<AIQuickCommand[]> {
    return Promise.resolve([...this.mockQuickCommands])
  }

  async getSessions(): Promise<IAISession[]> {
    const defaultSessions: IAISession[] = [
      {
        sessionId: 'ais_101',
        title: 'Ahmed Ali Clinical Summary',
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        lastActivityAt: new Date(Date.now() - 1800000).toISOString(),
        isPinned: true,
        turnCount: 4,
      },
      {
        sessionId: 'ais_102',
        title: 'Today\'s Revenue Query',
        startedAt: new Date(Date.now() - 86400000).toISOString(),
        lastActivityAt: new Date(Date.now() - 82000000).toISOString(),
        isPinned: false,
        turnCount: 2,
      },
    ]
    return Promise.resolve(defaultSessions)
  }

  async submitQuery(request: IAIQueryRequest): Promise<IAIQueryResponse> {
    const qLower = request.queryText.toLowerCase().trim()

    let answer = 'Information retrieved from local clinic database records.'
    let confidenceScore = 0.96
    let confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW' = 'HIGH'
    const dataSources = [
      {
        entityType: 'PATIENT' as const,
        entityId: 'pat_101',
        title: 'Ahmed Ali (MRN-2026-0042)',
        subtitle: 'Male, 48 yrs',
        route: '/dashboard/patients/pat_101',
      },
      {
        entityType: 'MEDICAL_RECORD' as const,
        entityId: 'rec_8812',
        title: 'Progress Note (2026-07-28)',
        subtitle: 'Hypertension & Diabetes Follow-up',
        route: '/dashboard/medical-records/rec_8812',
      },
    ]
    let navigationTarget: IAIQueryResponse['navigationTarget'] = undefined

    if (qLower.includes('ahmed') || qLower.includes('open patient')) {
      answer =
        'Patient Ahmed Ali (MRN-2026-0042) found in local database. Active medical flags include Type 2 Diabetes Mellitus and Essential Hypertension. Currently prescribed Metformin 500mg BD and Lisinopril 10mg OD.'
      confidenceScore = 0.98
      confidenceLevel = 'HIGH'
      navigationTarget = {
        module: 'PATIENT_PROFILE',
        route: '/dashboard/patients/pat_101',
        params: { patientId: 'pat_101' },
      }
    } else if (qLower.includes('appointment') || qLower.includes('roster')) {
      answer =
        'Today\'s scheduled appointments roster contains 14 patients. 8 checked in, 4 completed, 2 waiting in reception.'
      confidenceScore = 0.95
      confidenceLevel = 'HIGH'
      navigationTarget = {
        module: 'APPOINTMENTS',
        route: '/dashboard/appointments',
      }
    } else if (qLower.includes('revenue') || qLower.includes('report')) {
      answer =
        'Today\'s total clinic billing revenue is 4,250 EGP across 12 processed encounters.'
      confidenceScore = 0.92
      confidenceLevel = 'HIGH'
      navigationTarget = {
        module: 'REPORTS',
        route: '/dashboard/reports',
      }
    } else if (qLower.includes('diagnose') || qLower.includes('prescribe')) {
      answer =
        'Safety Limitation Notice: The Offline AI Assistant cannot diagnose diseases or prescribe medications. All clinical decisions remain under the sole authority of the treating physician.'
      confidenceScore = 0.70
      confidenceLevel = 'MODERATE'
    }

    const response: IAIQueryResponse = {
      queryId: `aiq_${Date.now()}`,
      sessionId: request.sessionId,
      answer,
      confidenceScore,
      confidenceLevel,
      dataSources,
      suggestedActions: [
        {
          id: 'act_01',
          label: 'Open Patient Profile',
          actionType: 'NAVIGATE',
          targetRoute: navigationTarget?.route || '/dashboard/patients/pat_101',
          iconName: 'UserCheck',
        },
        {
          id: 'act_02',
          label: 'View Prescriptions',
          actionType: 'NAVIGATE',
          targetRoute: '/dashboard/prescriptions',
          iconName: 'Pill',
        },
        {
          id: 'act_03',
          label: 'View Visit Timeline',
          actionType: 'NAVIGATE',
          targetRoute: '/dashboard/medical-records',
          iconName: 'Clock',
        },
      ],
      navigationTarget,
      generatedAt: new Date().toISOString(),
    }

    return Promise.resolve(response)
  }

  async rebuildIndex(): Promise<{ success: boolean; indexedCount: number }> {
    return Promise.resolve({ success: true, indexedCount: 4500 })
  }
}

export const aiAssistantApi = new AIAssistantApiService()
