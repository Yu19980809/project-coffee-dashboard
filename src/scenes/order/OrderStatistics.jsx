import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { Header, LineChart } from '../../components'

const OrderStatistics = () => {
  const [startDate, setStartDate] = useState(dayjs(new Date().getTime() - 7 * 24 * 60 * 60 * 1000))
  const [endDate, setEndDate] = useState(dayjs(new Date()))

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Header title='订单统计' subtitle='统计所有订单数据' />

      {/* 选择时间 */}
      <Box display='flex' alignItems='center' gap='20px' m='30px 0'>
        <Typography>时间选择:</Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="开始日期"
              value={ startDate }
              onChange={ newValue => setStartDate( newValue ) }
            />
          </DemoContainer>
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="结束日期"
              value={ endDate }
              onChange={ newValue => setEndDate( newValue ) }
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>

      {/* 订单数据 */}
      <Box display='flex' alignItems='center' gap='50px'>
        <Typography
          sx={{
            width: '300px',
            height: '60px',
            border: '1px solid white',
            borderRadius: '4px'
          }}
        >
          订单量
        </Typography>

        <Typography
          sx={{
            width: '300px',
            height: '60px',
            border: '1px solid white',
            borderRadius: '4px'
          }}
        >
          销售额
        </Typography>
      </Box>

      {/* 营业趋势 */}
      <Box height='60vh'>
        <LineChart />
      </Box>
    </Box>
  )
}

export default OrderStatistics