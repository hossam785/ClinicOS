import { Routes, Route } from 'react-router-dom'
import PatientsDirectoryView from '../views/PatientsDirectoryView'
import CreatePatientView from '../views/CreatePatientView'
import PatientProfileView from '../views/PatientProfileView'
import EditPatientProfileView from '../views/EditPatientProfileView'
import PatientAuditReviewView from '../views/PatientAuditReviewView'

export default function PatientsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PatientsDirectoryView />} />
      <Route path="/new" element={<CreatePatientView />} />
      <Route path="/:id" element={<PatientProfileView />} />
      <Route path="/:id/edit" element={<EditPatientProfileView />} />
      <Route path="/:id/audit" element={<PatientAuditReviewView />} />
    </Routes>
  )
}
