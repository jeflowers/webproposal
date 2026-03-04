import type { ReactNode } from 'react'
import styles from './SectionWrapper.module.css'

interface Props {
  id: string
  children: ReactNode
  className?: string
  as?: 'section' | 'div'
  ariaLabelledBy?: string
}

export default function SectionWrapper({
  id,
  children,
  className,
  as: Tag = 'section',
  ariaLabelledBy,
}: Props) {
  return (
    <Tag
      id={id}
      className={`${styles.wrapper} ${className || ''}`}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Tag>
  )
}
