import React from 'react'
import cn from 'classnames'
import {isEmpty} from 'lodash'
import styles from './messages.scss'

export enum MessagesType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface MessagesProps {
  type: MessagesType;
  messages: string[];
  className?: string;
}

export function Messages({messages, type, className}: MessagesProps) {
  if (isEmpty(messages)) {
    return null
  }

  const isError = type === MessagesType.ERROR
  const classes = cn(styles[type], className)

  return (
    <ul className={classes}
        data-locator={`${type}-messages`}
        aria-live={isError ? 'assertive' : 'polite'}>
      {
        messages.map((msg) => {
          return <li key={msg} className={styles.message}>{msg}</li>
        })
      }
    </ul>
  )
}
