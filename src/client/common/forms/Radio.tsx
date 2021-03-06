import React, {DetailedHTMLProps, InputHTMLAttributes, ReactElement, ReactNode} from 'react'
import classNames from 'classnames'
import {uniqueId} from 'lodash'
import styles from './radio.scss'

type RadioProps = {
  readonly children: ReactNode;
  readonly className?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export function Radio({children, className, ...inputProps}: RadioProps): ReactElement {
  const classes = classNames(styles.container, className)
  const id = uniqueId()

  return (
    <div className={classes}>
      <div className={styles.radio}>
        <input id={id}
               className={styles.input}
               type='radio'
               {...inputProps}/>
        <label htmlFor={id} className={styles.children}>{children}</label>
      </div>
    </div>
  )
}
