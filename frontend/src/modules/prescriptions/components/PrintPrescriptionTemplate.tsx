import React from 'react'
import type { Prescription } from '../types/prescription'

interface PrintPrescriptionTemplateProps {
  prescription: Prescription
}

export const PrintPrescriptionTemplate: React.FC<PrintPrescriptionTemplateProps> = ({ prescription }) => {
  return (
    <div className="print-prescription-container">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-prescription-container, .print-prescription-container * {
            visibility: visible;
          }
          .print-prescription-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20mm;
            box-sizing: border-box;
            background: white;
            font-family: Arial, sans-serif;
            color: #000;
          }
          .no-print {
            display: none !important;
          }
        }

        .print-prescription-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #0f172a;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        .rx-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #2563eb;
          margin-bottom: 1.5rem;
        }

        .rx-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          margin-bottom: 1.5rem;
        }

        .rx-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
        }

        .rx-table th, .rx-table td {
          border: 1px solid #cbd5e1;
          padding: 0.75rem;
          text-align: left;
          font-size: 0.875rem;
        }

        .rx-table th {
          background-color: #f1f5f9;
          font-weight: 700;
          color: #1e293b;
        }

        .rx-footer {
          margin-top: 3rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 0.75rem;
          color: #64748b;
        }
      `}</style>

      {/* Header */}
      <div className="rx-header">
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a' }}>
            {prescription.clinicName || 'ClinicOS Medical Center'}
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#475569' }}>
            {prescription.clinicAddress || '123 Healthcare Boulevard, Suite 400'}
          </p>
          <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.875rem', color: '#475569' }}>
            Phone: {prescription.clinicPhone || '(555) 019-2834'}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>
            PRESCRIPTION
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
            Code: {prescription.prescriptionNumber}
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.125rem' }}>
            Status: {prescription.status}
          </div>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="rx-meta-grid">
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
            Patient Information
          </h3>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 700 }}>
            Name: {prescription.patientName || prescription.patientId}
          </p>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#334155' }}>
            Code: {prescription.patientCode || 'PAT-N/A'} | Age/Gender: {prescription.patientAge ? `${prescription.patientAge} Yrs` : 'N/A'} ({prescription.patientGender || 'N/A'})
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155' }}>
            Visit Date: {prescription.visitDate}
          </p>
        </div>

        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
            Prescribing Doctor
          </h3>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 700 }}>
            {prescription.doctorName || 'Attending Physician'}
          </p>
          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#334155' }}>
            Specialty: {prescription.doctorSpecialty || 'General Practice'}
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155' }}>
            License No: {prescription.doctorLicenseNumber || 'MD-LIC-ACTIVE'}
          </p>
        </div>
      </div>

      {/* Diagnosis */}
      {prescription.diagnosisSummary && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', backgroundColor: '#eff6ff', borderRadius: '6px', borderLeft: '4px solid #2563eb' }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e40af' }}>Diagnosis: </span>
          <span style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>{prescription.diagnosisSummary}</span>
        </div>
      )}

      {/* Rx Section Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2563eb', fontFamily: 'serif' }}>Rx</span>
        <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
          Medication Orders ({prescription.medications?.length || 0})
        </h2>
      </div>

      {/* Medication Table */}
      <table className="rx-table">
        <thead>
          <tr>
            <th style={{ width: '5%' }}>#</th>
            <th style={{ width: '30%' }}>Medicine & Strength</th>
            <th style={{ width: '15%' }}>Form</th>
            <th style={{ width: '25%' }}>Dosage & Frequency</th>
            <th style={{ width: '15%' }}>Duration</th>
            <th style={{ width: '10%' }}>Qty</th>
          </tr>
        </thead>
        <tbody>
          {prescription.medications?.map((med, idx) => (
            <React.Fragment key={med.id || idx}>
              <tr>
                <td style={{ fontWeight: 700 }}>{idx + 1}</td>
                <td>
                  <strong>{med.medicineName}</strong>
                  {med.strength && <div style={{ fontSize: '0.8125rem', color: '#475569' }}>{med.strength}</div>}
                </td>
                <td>{med.dosageForm}</td>
                <td>
                  <div>{med.dosage}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#475569' }}>{med.frequency}</div>
                </td>
                <td>{med.duration}</td>
                <td>{med.quantity}</td>
              </tr>
              {med.instructions && (
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <td colSpan={6} style={{ fontSize: '0.8125rem', color: '#334155', fontStyle: 'italic' }}>
                    <strong>Instructions:</strong> {med.instructions}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Follow-up & Clinical Notes */}
      {(prescription.followUpAdvice || prescription.clinicalNotes) && (
        <div style={{ marginBottom: '2rem', display: 'grid', gap: '0.75rem' }}>
          {prescription.followUpAdvice && (
            <div style={{ fontSize: '0.875rem', padding: '0.625rem', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
              <strong>Follow-Up Advice:</strong> {prescription.followUpAdvice}
            </div>
          )}
          {prescription.clinicalNotes && (
            <div style={{ fontSize: '0.875rem', padding: '0.625rem', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
              <strong>Clinical Notes / Warnings:</strong> {prescription.clinicalNotes}
            </div>
          )}
        </div>
      )}

      {/* Doctor Signature Block */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
        <div style={{ width: '250px', textAlign: 'center' }}>
          <div style={{ height: '50px', borderBottom: '1px solid #0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'cursive', fontSize: '1.25rem', color: '#1e3a8a' }}>
              {prescription.doctorName || 'Dr. Signature'}
            </span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{prescription.doctorName || 'Attending Physician'}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Authorized Prescriber Signature</div>
        </div>
      </div>

      {/* Footer */}
      <div className="rx-footer">
        <div>ClinicOS ePrescription Platform | Verified Clinical Document</div>
        <div>Print Count: {prescription.printInfo?.printCount || 1} | Date: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  )
}

export default PrintPrescriptionTemplate
