import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import { Snackbar, SnackbarContent, makeStyles } from '@material-ui/core'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark
  },
  success: {
    backgroundColor: green[600]
  }
}))

type Config = {
  onClose?: () => any
  duration?: number
}

export default class Message {
  private static render (type: 'error' | 'info' | 'success', msg: string, config: Config = {}) {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const Cpt = () => {
      const classes = useStyles() as any
      const [open, setOpen] = useState(true)
      useEffect(() => {
        if (!open) {
          setTimeout(() => {
            document.body.removeChild(div)
          }, 2000)
        }
      }, [open])
      return (
        <Snackbar
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top'
          }}
          open={open}
          onClose={() => {
            setOpen(false)
            config.onClose && config.onClose()
          }}
          autoHideDuration={config.duration || 2000}
        >
          <SnackbarContent
            classes={{ root: classes[type] }}
            message={<span>{msg}</span>}
          />
        </Snackbar>
      )
    }
    render(<Cpt />, div)
  }

  static error (msg: string, config?: Config) {
    Message.render('error', msg, config)
  }

  static success (msg: string, config?: Config) {
    Message.render('success', msg, config)
  }
}
