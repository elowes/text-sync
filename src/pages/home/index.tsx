import React, { useCallback, useState } from 'react'
import { Paper, Typography, Container, Grid, TextField, AppBar, Toolbar, Divider, Button, useTheme, useMediaQuery } from '@material-ui/core'
import { debounce } from 'lodash'
import { getTextFromCode, addText } from '../../api'
import Message from './Message'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default () => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.only('xs'))
  const [text, setText] = useState('')
  const [cpBtnVisible, setCpBtnVisible] = useState(false)
  const [code, setCode] = useState('')
  const input = useCallback<any>(debounce((v: string) => {
    if (v.length === 4 && /^\d{4}$/.test(v)) {
      // 查找文本
      getTextFromCode(v).then((res) => {
        if (res.success) {
          Message.success('还原成功，点击按钮可快速复制文本')
          setCpBtnVisible(true)
          setCode('')
          setText(res.content)
        } else {
          Message.error(res.error.message)
        }
      })
    } else if (v.length) {
      addText(v).then((res) => {
        if (res.success) {
          setCode(res.content)
          setCpBtnVisible(false)
          Message.success(`编码：${res.content}`)
        } else {
          Message.error(res.error.message)
        }
      })
    }
  }, 1e3), [])
  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6'>
            TextSync
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth='xl' style={{ paddingTop: 16 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                input(e.target.value)
              }}
              multiline
              rows={10}
              rowsMax={50}
              variant='outlined'
              label='输入文本或 4 位数字编码'
              fullWidth
            />
          </Grid>
          {
            code &&
              (
                <Grid item xs={12}>
                  <Typography variant='h3'>{code}</Typography>
                </Grid>
              )
          }
          {
            cpBtnVisible &&
              (
                <Grid item xs={12}>
                  <CopyToClipboard text={text}
                    onCopy={() => {
                      Message.success('复制文本成功')
                    }}>
                    <Button
                      variant='contained'
                      color='primary'
                      fullWidth={matches}
                    >
                      复制文本
                    </Button>
                  </CopyToClipboard>
                </Grid>
              )
          }
          <Grid item xs={12}>
            <Paper style={{ padding: 16 }}>
              <Typography variant='button' component='div'>
                使用方法：
              </Typography>
              <Typography variant='caption' component='div'>
                情景一：在上方输入框中输入文本，将会生成随机 4 位数字编码
              </Typography>
              <Typography variant='caption' component='div'>
                情景二：输入 4 位数字编码，如果正确，将会替换成对应的文本
              </Typography>
              <Divider style={{ margin: '8px 0' }} />
              <Typography variant='caption' component='div'>
                <Typography variant='caption' component='span' style={{ color: 'red', marginRight: 4 }}>*</Typography>
                每个编码仅能在 5 分钟内被使用一次
              </Typography>
              <Typography variant='caption' component='div'>
                <Typography variant='caption' component='span' style={{ color: 'red', marginRight: 4 }}>*</Typography>
                为了信息安全，请避免输入银行卡、密码等隐私信息
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
