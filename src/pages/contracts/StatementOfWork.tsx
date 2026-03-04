import DocumentShell from '../../components/contracts/DocumentShell'
import DocumentHeader from '../../components/contracts/DocumentHeader'
import SignatureBlock from '../../components/contracts/SignatureBlock'
import { SOW_PHASES, SOW_MILESTONES } from '../../data/contractData'
import styles from './StatementOfWork.module.css'

const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default function StatementOfWork() {
  return (
    <DocumentShell>
      <DocumentHeader
        docType="Statement of Work"
        title="Website Redesign -- Statement of Work"
        date={today}
        docNumber="SOW-001"
      />

      <div className={styles.intro}>
        <p>
          This Statement of Work (&ldquo;SOW&rdquo;) is issued pursuant to the Master Service Agreement
          dated between the parties and describes the specific Services, deliverables, timeline, and
          compensation for the MEC Eye Specialists website redesign project.
        </p>
        <p className={styles.refLabel}>Reference Agreement</p>
        <p className={styles.refValue}>MSA-001 -- Master Service Agreement</p>
      </div>

      {SOW_PHASES.map((phase, phaseIdx) => {
        const totalHours = phase.deliverables.reduce((sum, d) => sum + d.hours, 0)
        return (
          <div key={phase.name} className={styles.phase}>
            <div className={styles.phaseHead}>
              <span className={styles.phaseBadge}>Phase {phaseIdx + 1}</span>
              <h2 className={styles.phaseTitle}>{phase.name}</h2>
            </div>
            <p className={styles.phaseDesc}>{phase.description}</p>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Deliverable</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                {phase.deliverables.map((d) => (
                  <tr key={d.name}>
                    <td>
                      <div className={styles.delivName}>{d.name}</div>
                      <div className={styles.delivDesc}>{d.description}</div>
                    </td>
                    <td>{d.hours}</td>
                  </tr>
                ))}
                <tr className={styles.totalRow}>
                  <td>Total</td>
                  <td>{totalHours} hrs</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      })}

      <div className={styles.milestones}>
        <h2 className={styles.milestonesTitle}>Project Milestones</h2>
        <div className={styles.milestoneGrid}>
          {SOW_MILESTONES.map((m, i) => (
            <div key={m.name} className={styles.milestone}>
              <p className={styles.milestoneNum}>Milestone {i + 1}</p>
              <p className={styles.milestoneName}>{m.name}</p>
              <p className={styles.milestoneDesc}>{m.description}</p>
              {m.payment && (
                <p className={styles.milestonePayment}>{m.payment}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.assumptions}>
        <h2 className={styles.assumptionsTitle}>Assumptions &amp; Dependencies</h2>
        <ul className={styles.assumptionsList}>
          <li>Client will provide all content (doctor bios, service descriptions, photography) within two (2) weeks of project kickoff.</li>
          <li>Feedback and approvals will be provided within five (5) business days of each deliverable review.</li>
          <li>Up to two (2) rounds of design revisions are included per page. Additional revisions will be billed at Provider&rsquo;s standard hourly rate.</li>
          <li>Phase 2 add-ons are optional and can be contracted separately at any time after Phase 1 launch.</li>
          <li>Domain transfer and DNS changes require Client authorization and may involve third-party processing time.</li>
          <li>Third-party service fees (hosting, email, APIs) are billed separately at cost.</li>
        </ul>
      </div>

      <SignatureBlock />
    </DocumentShell>
  )
}
