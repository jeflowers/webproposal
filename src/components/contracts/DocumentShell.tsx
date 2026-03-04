import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Printer, ArrowLeft } from 'lucide-react'
import styles from './DocumentShell.module.css'

interface DocumentShellProps {
  children: ReactNode
  pageCount?: number
}

export default function DocumentShell({ children, pageCount }: DocumentShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.toolbar}>
        <Link to="/contracts" className={styles.backLink}>
          <ArrowLeft size={14} />
          All Documents
        </Link>
        <div className={styles.toolbarSpacer} />
        <button
          className={styles.toolbarBtnPrimary}
          onClick={() => window.print()}
        >
          <Printer size={14} />
          Print / Save PDF
        </button>
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.confidential}>Confidential</span>
          <span>Prepared for MEC Eye Specialists</span>
        </div>
        {pageCount && <span>Page 1 of {pageCount}</span>}
      </div>
    </div>
  )
}
