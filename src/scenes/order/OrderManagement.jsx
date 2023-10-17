import { useState, useEffect } from 'react'
import { Box, Typography, Modal, Button, Grid, useTheme } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport  } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { Header, CustomButton } from '../../components'
import { tokens } from '../../theme'
import {
  fetchAllOrders,
  deleteOrder,
  deleteOrders,
  doneOrder
} from '../../api'

const DataGridCard = ({colors, data}) => {
  const imageCellRenderer = image => (
    <Box
      display='flex'
      justifyContent='center'
      width='50%'
      m='0 auto'
      p='5px'
    >
      <img
        src={ image }
        alt='商品图片'
        style={{ width: '40px', height: '40px', borderRadius: '5px', cursor: 'pointer' }}
      />
    </Box>
  )

  const temperatureCellRenderer = temperature => (
    <Box
      display='flex'
      justifyContent='center'
      width='50%'
      m='0 auto'
      p='5px'
    >
      {!temperature ? '无' : temperature}
    </Box>
  )

  const sugarCellRenderer = sugar => (
    <Box
      display='flex'
      justifyContent='center'
      width='50%'
      m='0 auto'
      p='5px'
    >
      {!sugar ? '无' : sugar}
    </Box>
  )

  const addonCellRenderer = addon => (
    <Box
      display='flex'
      justifyContent='center'
      width='50%'
      m='0 auto'
      p='5px'
    >
      {
        addon.length === 0
        ? '无'
        : addon.join(',')
      }
    </Box>
  )

  const priceCellRenderer = (price, addonPrice) => (
    <Box
      display='flex'
      justifyContent='center'
      width='50%'
      m='0 auto'
      p='5px'
    >
      {price + addonPrice}
    </Box>
  )

  const columns = [
    {
      field: 'image',
      headerName: '商品图片',
      renderCell: ({row:{image}}) => imageCellRenderer(image)
    },
    { field: 'name', headerName: '商品名称', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'temperature', headerName: '温度', flex: 1, renderCell: ({row: {temperature}}) => temperatureCellRenderer(temperature) },
    { field: 'sugar', headerName: '糖度', flex: 1, renderCell: ({row: {sugar}}) => sugarCellRenderer(sugar) },
    { field: 'addon', headerName: '小料', flex: 1, renderCell: ({row: {addon}}) => addonCellRenderer(addon) },
    { field: 'price', headerName: '价格（元）', renderCell: ({row: {price, addonPrice}}) => priceCellRenderer(price, addonPrice)},
    { field: 'count', headerName: '购买数量' }
  ]

  return (
    <Box
      height='auto'
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
        disableRowSelectionOnClick 
        rows={ data }
        getRowId={ row => row._id }
        columns={ columns }
      />
    </Box>
  )
}

// 订单详情
const OrderDetails = ({colors, commodities, user, type, status, price, count, payment, note, address, shop}) => (
  <Box display='flex' flexDirection='column' gap='20px'>
    {/* 商品列表 */}
    <DataGridCard colors={colors} data={commodities} />

    {/* 订单信息 */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Box sx={{ borderLeft: `8px solid ${colors.greenAccent[200]}` }} />
        <Box sx={{ fontWeight: 'bold' ,color: colors.greenAccent[200] }}>订单信息</Box>
      </Box>

      <Box display='flex' flexDirection='column' gap='10px' padding='0 20px'>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box>订单类型：{type}</Box>
          </Grid>

          <Grid item xs={6}>
            <Box>订单状态：{status}</Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box>商品总数：{count}</Box>
          </Grid>

          <Grid item xs={6}>
            <Box>商品总价：{price}</Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box>出单店铺：{shop.name}</Box>
          </Grid>

          <Grid item xs={6}>
            <Box>店铺地址：{shop.location}</Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box>支付方式：{payment}</Box>
          </Grid>

          <Grid item xs={6}>
            <Box>所用优惠券：无</Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box>备注信息：{note}</Box>
          </Grid>
        </Grid>
      </Box>
    </Box>

    {/* 用户信息 */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Box sx={{ borderLeft: `8px solid ${colors.greenAccent[200]}` }} />
        <Box sx={{ fontWeight: 'bold' ,color: colors.greenAccent[200] }}>用户信息</Box>
      </Box>

      <Box display='flex' flexDirection='column' gap='10px' padding='0 20px'>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box>下单用户：{user.name}</Box>
          </Grid>

          <Grid item xs={6}>
            <Box>绑定电话：{user.tel}</Box>
          </Grid>
        </Grid>
      </Box>
    </Box>

    {/* 收货信息 */}
    {type === '外送' && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Box sx={{ borderLeft: `8px solid ${colors.greenAccent[200]}` }} />
          <Box sx={{ fontWeight: 'bold' ,color: colors.greenAccent[200] }}>收货信息</Box>
        </Box>

        <Box display='flex' flexDirection='column' gap='10px' padding='0 20px'>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box>联系人：{address.name}</Box>
            </Grid>

            <Grid item xs={6}>
              <Box>联系电话：{address.tel}</Box>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box>收货地址：{address.location + address.door}</Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    )}
  </Box>
)

const OrderManagement = () => {
  const theme = useTheme()
  const colors = tokens( theme.palette.mode )

  // 勾选的行
  const [ selectedRows, setSelectedRows ] = useState( [] )

  // 当前点击的行
  const [ clickedRow, setClickedRow ] = useState({commodities: []})

  // 订单列表
  const [ orders, setOrders ] = useState( [] )

  // 删除（单个）订单相关参数
  const [ deleteOrderOpen, setDeleteOrderOpen ] = useState( false )

  // 批量删除订单相关参数
  const [ deleteOrdersOpen, setDeleteOrdersOpen ] = useState( false )

  // 订单详情相关参数
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)

  // 完成订单相关参数
  const [orderDoneOpen, setOrderDoneOpen] = useState(false)

  // 请求订单列表
  useEffect(() => {
    fetchAllOrders().then(res => {
      const orders = res.data.data
      const newOrders = orders.map(item => {
        return {...item, createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
      })
      setOrders(newOrders)
    })
  }, [])

  // 删除（单个）订单
  const handleDeleteOrder = () => {
    deleteOrder(clickedRow._id)
      .then(() => {
        const newOrders = orders.filter(item => item._id !== clickedRow._id)
        setOrders(newOrders)
        setDeleteOrderOpen(false)
        setClickedRow({})
        toast.success('删除成功')
      })
  }

  // 批量删除订单
  const handleDeleteOrders = () => {
    deleteOrders(selectedRows)
      .then(() => {
        const newOrders = orders.filter(item => !selectedRows.includes(item._id))
        setOrders(newOrders)
        setDeleteOrdersOpen(false)
        setSelectedRows([])
        toast.success('删除成功')
      })
  }

  // 完成订单
  const handleDoneOrder = () => {
    doneOrder(clickedRow._id)
      .then(() => {
        const newOrders = orders.map(item => {
          return item._id === clickedRow._id
          ? {...item, status: '已完成'}
          : item
        })

        setOrders(newOrders)
        setOrderDoneOpen(false)
        setClickedRow({})
        toast.success('修改订单状态成功')
      })
  }

  // 表格相关参数
  const commoditiesCellRenderer = commodities => (
    <Box
      display='flex'
      flexDirection='column'
      width='100%'
      p='5px'
    >
      {commodities.map(item => (
        <Box key={item.name} display='flex' flexDirection='column' gap='5px'>
          <Box display='flex' alignItems='center' gap='5px'>
            <img src={item.image} alt={item.name} style={{width: '30px', borderRadius: '5px'}} />
            {item.name} x{item.count}
          </Box>
        </Box>
      ))}
    </Box>
  )

  const statusCellRenderer = status => (
    <Box
      display='flex'
      width='50%'
      m='0 auto'
      p='5px'
    >
      {
        status === '制作中'
        ? <span style={{color: `${colors.greenAccent[200]}`, fontWeight: 'bold'}}>{'制作中...'}</span>
        : <span>{'已完成'}</span>
      }
    </Box>
  )

  const operationsCellRenderer = () => (
    <Box
      display='flex'
      gap='5px'
      width='50%'
      m='0 auto'
      p='5px'
    >
      <CustomButton colors={colors} text='详情' handleClick={() => setOrderDetailsOpen(true)} />
      <CustomButton colors={colors} text='完成' handleClick={() => setOrderDoneOpen(true)} />
      <CustomButton colors={colors} text='删除' handleClick={() => setDeleteOrderOpen(true)} />
    </Box>
  )

  const columns = [
    { field: 'commodities', headerName: '商品信息', flex: 1, renderCell: ({row: {commodities}}) => commoditiesCellRenderer(commodities) },
    { field: 'price', headerName: '支付金额（元）', flex: 0.5 },
    { field: 'payment', headerName: '支付方式', flex: 0.5 },
    { field: 'createdAt', headerName: '支付时间', flex: 1 },
    { field: 'status', headerName: '订单状态', flex: 1, renderCell: ({row: {status}}) => statusCellRenderer(status) },
    { field: 'operations', headerName: '操作', flex: 1.5, renderCell: operationsCellRenderer }
  ]

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
        <CustomButton colors={ colors } text='批量删除' handleClick={ () => !selectedRows.length ? toast.error( '请选择要删除的订单' ) : setDeleteOrdersOpen( true ) } />
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Header title='订单管理' subtitle='管理订单' />

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
          rows={ orders }
          getRowHeight={() => 'auto'}
          getRowId={ row => row._id }
          columns={ columns }
          components={{ Toolbar: CustomToolbar }}
          rowSelectionModel={ selectedRows }
          onRowSelectionModelChange={ id => setSelectedRows( id ) }
          onRowClick={ e => setClickedRow( e.row ) }
        />
      </Box>

      {/* DELETE ORDER MODAL */}
      <Modal
        open={ deleteOrderOpen }
        onClose={ () => setDeleteOrderOpen( false ) }
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
            <Typography sx={{ textAlign: 'center' }}>确认删除当前订单吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteOrderOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteOrder }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* DELETE ORDERS MODAL */}
      <Modal
        open={ deleteOrdersOpen }
        onClose={ () => setDeleteOrdersOpen( false ) }
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
            <Typography sx={{ textAlign: 'center' }}>确认删除选中的所有订单吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteOrdersOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteOrders }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* ORDER DETAILS MODAL */}
      <Modal
        open={ orderDetailsOpen }
        onClose={ () => setOrderDetailsOpen( false ) }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60vw',
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
            订单详情
          </Typography>

          <OrderDetails colors={colors} {...clickedRow} />
        </Box>
      </Modal>

      {/* DONE ORDER MODAL */}
      <Modal
        open={ orderDoneOpen }
        onClose={ () => setOrderDoneOpen( false ) }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60vw',
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
            完成提示
          </Typography>

          <Box id='modal-modal-description'>
            <Typography sx={{ marginBottom: '10px', textAlign: 'center' }}>确认已完成该订单中的所有商品吗？</Typography>

            <DataGridCard colors={colors} data={clickedRow.commodities} />

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setOrderDoneOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDoneOrder }
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

export default OrderManagement