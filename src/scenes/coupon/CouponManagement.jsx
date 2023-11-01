import { useState, useEffect } from 'react'
import { Box, Typography, Button, Modal, TextField, Switch, useTheme } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport  } from '@mui/x-data-grid'
import { Formik } from 'formik'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import * as yup from 'yup'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Header, CustomButton } from '../../components'
import { tokens } from '../../theme'
import {
  fetchAllCoupons,
  onCoupon,
  offCoupon,
  offCoupons,
  addCoupon,
  editCoupon,
  deleteCoupon
} from '../../api'

// 添加/编辑 优惠券表单
const Form = ( { isAdd, row, handleFormSubmit, handleCancel, selectedStartDate, setSelectedStartDate, selectedEndDate, setSelectedEndDate } ) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required( 'required' ),
    value: yup.string().required( 'required' ),
  })

  const initialValues = isAdd
  ?  {
    name: '',
    value: '',
  }
  : {
    name: row.name,
    value: row.value,
  }

  return (
    <Formik
      initialValues={ initialValues }
      validationSchema={ validationSchema }
      onSubmit={ handleFormSubmit }
    > 
      { ( { values, errors, touched, handleBlur, handleChange, handleSubmit } ) => (
        <form onSubmit={ handleSubmit }>
          <Box
            display='flex'
            flexDirection='column'
            gap='30px'
          >
            <TextField
              type='text'
              variant='filled'
              label='优惠券名称'
              name='name'
              value={ values.name }
              fullWidth
              helperText={ touched.name && errors.name }
              error={ !!touched.name && !!errors.name }
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

            <TextField
              type='text'
              variant='filled'
              label='优惠券面额'
              name='value'
              value={ values.value }
              fullWidth
              helperText={ touched.value && errors.value }
              error={ !!touched.value && !!errors.value }
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

            <Box
              id='modal-modal-description'
              display='flex'
              flexDirection='column'
              gap='30px'
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="生效时间"
                    value={ selectedStartDate }
                    onChange={ newValue => setSelectedStartDate( newValue ) }
                  />
                </DemoContainer>
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="过期时间"
                    value={ selectedEndDate }
                    onChange={ newValue => setSelectedEndDate( newValue ) }
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Box>
          </Box>

          <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
            <Button
              type='button'
              variant='contained'
              color='primary'
              onClick={ handleCancel }
            >
              取消
            </Button>

            <Button
              type='submit'
              variant='contained'
              color='secondary'
            >
              确认
            </Button>
          </Box>
        </form>
      ) }
    </Formik>
  )
}

const CouponManagement = () => {
  const theme = useTheme()
  const colors = tokens( theme.palette.mode )

  // 勾选的行
  const [ selectedRows, setSelectedRows ] = useState( [] )

  // 当前点击的行
  const [ clickedRow, setClickedRow ] = useState( {} )

  // 优惠券列表
  const [ coupons, setCoupons ] = useState( [] )

  // 批量下架相关参数
  const [ offCouponsOpen, setOffCouponsOpen ] = useState( false )

  // 添加/编辑 优惠券相关参数
  const [isAdd, setIsAdd] = useState(true)
  const [ addOrEditCouponOpen, setAddOrEditCouponOpen ] = useState( false )
  const [ selectedStartDate, setSelectedStartDate ] = useState()
  const [ selectedEndDate, setSelectedEndDate ] = useState()

  // 删除优惠券相关参数
  const [ deleteCouponOpen, setDeleteCouponOpen ] = useState( false )

  // 判断是否过期
  const isExpired = date => {
    const current = new Date().getTime()
    const time = new Date(date).getTime()
    return time <= current
  }

  // 请求优惠券列表数据
  useEffect(() => {
    fetchAllCoupons().then(res => {
      let data = res.data.data
      data = data.map(item => {
        return isExpired(item.end_date)
        ? {...item, status: 'off'}
        : item
      })
      setCoupons(data)
    })
  }, [])

  // 切换生效状态
  const handleStatusSwitch = (id, end_date, status) => {
    // 先判断是否已过期，未过期的才能切换
    if (isExpired(end_date)) {
      toast.error('该优惠券已过期，无法切换生效状态')
      return
    }

    if (status === 'on') {
      offCoupon(id)
        .then(() => {
          const newCoupons = coupons.map(item => item._id === id ? {...item, status: 'off'} : item)
          setCoupons(newCoupons)
          toast.success('下架成功')
        })
    } else {
      onCoupon(id)
        .then(() => {
          const newCoupons = coupons.map(item => item._id === id ? {...item, status: 'on'} : item)
          setCoupons(newCoupons)
          toast.success('上架成功')
        })
    }
  }

  // 批量下架优惠券
  const handleOffCoupons = () => {
    offCoupons({idList: selectedRows})
      .then(() => {
        const newCoupons = coupons.map(item => selectedRows.includes(item._id) ? {...item, status: 'off'} : item)
        setCoupons(newCoupons)
        setOffCouponsOpen(false)
        setSelectedRows([])
        toast.success('下架成功')
      })
  }

  // 点击添加按钮
  const handleClickAdd = () => {
    setIsAdd(true)
    setAddOrEditCouponOpen(true)
    setSelectedStartDate(dayjs(new Date()))
    setSelectedEndDate(dayjs(new Date().getTime() + 7 * 24 * 60 * 60 * 1000))
  }

  // 添加优惠券
  const handleAddCoupon = e => {
    const {name, value} = e
    addCoupon({name, value, start_date: selectedStartDate, end_date: selectedEndDate})
      .then(res => {
        setCoupons([res.data.data, ...coupons])
        setAddOrEditCouponOpen(false)
        toast.success('添加成功')
      })
  }

  // 点击编辑按钮
  const handleClickEdit = (startDate, endDate) => {
    setIsAdd(false)
    setAddOrEditCouponOpen(true)
    setSelectedStartDate(dayjs(startDate))
    setSelectedEndDate(dayjs(endDate))
  }

  // 编辑优惠券
  const handleEditCoupon = e => {
    const {name, value} = e
    editCoupon({name, value, start_date: selectedStartDate, end_date: selectedEndDate, id: clickedRow._id})
      .then(() => {
        const newCoupons = coupons.map(item => {
          return item._id === clickedRow._id
          ? {...item, name, value, start_date: selectedStartDate, end_date: selectedEndDate}
          : item
        } )

        setCoupons(newCoupons)
        setAddOrEditCouponOpen(false)
        setClickedRow({})
        toast.success('添加成功')
      })
  }

  // 删除优惠券
  const handleDeleteCoupon = () => {
    deleteCoupon(clickedRow._id)
      .then(() => {
        const newCoupons = coupons.filter(item => item._id !== clickedRow._id)
        setCoupons(newCoupons)
        setDeleteCouponOpen(false)
        setClickedRow({})
        toast.success('删除成功')
      })
  }

  // 表格相关参数
  const columns = [
    { field: 'name', headerName: '名称', flex: 0.5, cellClassName: 'name-column--cell' },
    { field: 'value', headerName: '面额（元）', flex: 0.5 },
    { field: 'start_date', headerName: '生效时间', flex: 1 },
    { field: 'end_date', headerName: '到期时间', flex: 1 },
    {
      field: 'status',
      headerName: '生效状态',
      flex: 0.5,
      renderCell: ( { row: { _id, end_date, status } } ) => (
        <Box
          display='flex'
          justifyContent='center'
          width='50%'
          m='0 auto'
          p='5px'
        >
          <Switch
            checked={ status === 'on' }
            color='secondary'
            onChange={ () => handleStatusSwitch( _id, end_date, status ) }
          />
        </Box>
      )
    },
    {
      field: 'operations',
      headerName: '操作',
      flex: 1,
      renderCell: ({row: {start_date, end_date}}) => (
        <Box
          display='flex'
          justifyContent='center'
          gap='10px'
          width='80%'
          m='0 auto'
          p='5px'
        >
          <CustomButton colors={ colors } text='编辑' handleClick={() => handleClickEdit(start_date, end_date)} />
          <CustomButton colors={ colors } text='删除' handleClick={ () => setDeleteCouponOpen( true ) } />
        </Box>
      )
    }
  ]

  const rows = coupons.map( item => {
    const obj = {
      _id: item._id,
      name: item.name,
      value: item.value,
      start_date: dayjs( item.start_date ).format( 'YYYY-MM-DD' ),
      end_date: dayjs( item.end_date ).format( 'YYYY-MM-DD' ),
      status: item.status
    }

    return obj
  } )

  // 自定义表格工具栏
  const CustomToolbar = () => (
    <GridToolbarContainer
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0'
      }}
    >
      <Box>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Box>
  
      <Box display='flex' gap='10px'>
        <CustomButton colors={ colors } text='添加优惠券' handleClick={handleClickAdd} />
        <CustomButton colors={ colors } text='批量下架' handleClick={ () => !selectedRows.length ? toast.error( '请选择要下架的优惠券' ) : setOffCouponsOpen( true ) } />
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Header title='优惠券管理' subtitle='管理所有优惠券' />

      {/* DATA GRID */}
      <Box
        height='75vh'
        m='40px 0 0 0'
        sx={{
          '& .MuiDataGrid-root': { border: 'none' },
          '& .MuiDataGrid-cell': { borderBottom: 'none' },
          '& .name-column--cell': { color: colors.greenAccent[300] },
          '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.blueAccent[700], borderBottom: 'none' },
          '& .MuiDataGrid-virtualScroller': { backgroundColor: colors.primary[400] },
          '& .MuiDataGrid-footerContainer': { backgroundColor: colors.blueAccent[700], borderTop: 'none' },
          '& .MuiCheckbox-root': { color: `${ colors.greenAccent[200] } !important` },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': { color: `${ colors.grey[100] } !important` }
        }}
      >
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick 
          rows={ rows }
          getRowId={ row => row._id }
          columns={ columns }
          components={{ Toolbar: CustomToolbar }}
          rowSelectionModel={ selectedRows }
          onRowSelectionModelChange={ id => setSelectedRows( id ) }
          onRowClick={ e => setClickedRow( e.row ) }
        />
      </Box>

      {/* ADD / EDIT COUPON MODAL */}
      <Modal
        open={ addOrEditCouponOpen }
        onClose={ () => setAddOrEditCouponOpen( false ) }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            p: 4,
            bgcolor: colors.primary[400],
            border: '2px solid #000',
            borderRadius: '10px',
            boxShadow: 24,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: '10px', textAlign: 'center' }}
          >
            { isAdd ? '添加' : '编辑' }优惠券
          </Typography>

          <Box id='modal-modal-description'>
            <Form
              isAdd={ isAdd }
              row={ clickedRow }
              selectedStartDate={ selectedStartDate }
              setSelectedStartDate={ setSelectedStartDate }
              selectedEndDate={ selectedEndDate }
              setSelectedEndDate={ setSelectedEndDate }
              handleFormSubmit={ isAdd ? handleAddCoupon : handleEditCoupon }
              handleCancel={ () => setAddOrEditCouponOpen(false) }
            />
          </Box>
        </Box>
      </Modal>

      {/* OFF COUPONS MODAL */}
      <Modal
        open={ offCouponsOpen }
        onClose={ () => setOffCouponsOpen( false ) }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            p: 4,
            bgcolor: colors.primary[400],
            border: '2px solid #000',
            borderRadius: '10px',
            boxShadow: 24,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: '10px', textAlign: 'center' }}
          >
            下架提示
          </Typography>

          <Box id='modal-modal-description'>
            <Typography sx={{ textAlign: 'center' }}>确认下架选中的所有优惠券吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setOffCouponsOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleOffCoupons }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* DELETE COUPON MODAL */}
      <Modal
        open={ deleteCouponOpen }
        onClose={ () => setDeleteCouponOpen( false ) }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            p: 4,
            bgcolor: colors.primary[400],
            border: '2px solid #000',
            borderRadius: '10px',
            boxShadow: 24,
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginBottom: '10px', textAlign: 'center' }}
          >
            删除提示
          </Typography>

          <Box id='modal-modal-description'>
            <Typography sx={{ textAlign: 'center' }}>确认删除当前优惠券吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteCouponOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteCoupon }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default CouponManagement