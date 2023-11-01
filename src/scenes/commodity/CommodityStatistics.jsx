import { useState, useEffect } from 'react'
import { Box, useTheme } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport  } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Header, CustomButton } from '../../components'
import { tokens } from '../../theme'
import { fetchAllCommoditiesData } from '../../api'


const CommodityStatistics = () => {
  const theme = useTheme()
  const colors = tokens( theme.palette.mode )

  const [commodities, setCommodities] = useState([])
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  // 设置初始时间并请求数据
  useEffect(() => {
    const current = new Date()
    const year = current.getFullYear()
    const month = ('0' + (current.getMonth() + 1)).slice(-2)
    const day = ('0' + current.getDate()).slice(-2)
    const start = year + '-' + month + '-01'
    const end = year + '-' + month + '-' + day
    setStartDate(dayjs(new Date(start)))
    setEndDate(dayjs(new Date(end)))

    fetchAllCommoditiesData(start, end)
      .then(res => setCommodities(res.data.data))
  }, [])

  // 点击查询
  const handleClickQuery = () => {
    fetchAllCommoditiesData(
      dayjs(startDate).format('YYYY-MM-DD'),
      dayjs(endDate).format('YYYY-MM-DD')
    ).then(res => {
      toast.success('查询成功')
      setCommodities(res.data.data)
    })
  }

  // 表格相关参数
  const columns = [
    {
      field: 'image',
      headerName: '商品图片',
      renderCell: ( { row: { image } } ) => (
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
    },
    { field: 'name', headerName: '商品名称', flex: 1, cellClassName: 'name-column--cell' },
    // {
    //   field: 'category',
    //   headerName: '商品类型',
    //   renderCell: ( { row: { category } } ) => (
    //     <Box
    //       display='flex'
    //       justifyContent='center'
    //       width='50%'
    //       m='0 auto'
    //       p='5px'
    //     >
    //       {category.name}
    //     </Box>
    //   )
    // },
    // { field: 'price', headerName: '商品售价（元）'},
    // { field: 'sales', headerName: '销量'},
    { field: 'count', headerName: '销量'},
    { field: 'prices', headerName: '销售额'},
    // {
    //   field: 'status',
    //   headerName: '上架状态',
    //   flex: 0.5,
    //   renderCell: ( { row: { _id, status } } ) => (
    //     <Box
    //       display='flex'
    //       justifyContent='center'
    //       width='50%'
    //       m='0 auto'
    //       p='5px'
    //     >
    //       <Switch
    //         checked={ status === 'on' }
    //         color='secondary'
    //         onChange={ () => handleStatusSwitch( _id, status ) }
    //       />
    //     </Box>
    //   )
    // },
    // {
    //   field: 'operations',
    //   headerName: '操作',
    //   flex: 1,
    //   renderCell: ({row: {category}}) => (
    //     <Box
    //       display='flex'
    //       justifyContent='center'
    //       gap='10px'
    //       width='80%'
    //       m='0 auto'
    //       p='5px'
    //     >
    //       <CustomButton colors={ colors } text='编辑' handleClick={ () => handleClickEdit(category.name) } />
    //       <CustomButton colors={ colors } text='删除' handleClick={ () => setDeleteCommodityOpen( true ) } />
    //     </Box>
    //   )
    // }
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
  
      <Box display='flex' alignItems='flex-end' gap='10px'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="开始时间"
              value={ startDate }
              onChange={ newValue => setStartDate(newValue) }
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="结束时间"
              value={ endDate }
              onChange={ newValue => setEndDate(newValue) }
            />
          </DemoContainer>
        </LocalizationProvider>
        <CustomButton colors={ colors } text='查询' height={'33px'} handleClick={handleClickQuery} />
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Header title='商品统计' subtitle='统计所有商品数据' />

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
          rows={ commodities }
          getRowId={ row => row._id }
          columns={ columns }
          components={{ Toolbar: CustomToolbar }}
          // rowSelectionModel={ selectedRows }
          // onRowSelectionModelChange={ id => setSelectedRows( id ) }
          // onRowClick={ e => setClickedRow( e.row ) }
        />
      </Box>
    </Box>
  )
}

export default CommodityStatistics