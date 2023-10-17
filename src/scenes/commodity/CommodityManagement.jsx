import { useState, useEffect } from 'react'
import { Box, Switch, Modal, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, useTheme } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport  } from '@mui/x-data-grid'
import { Formik } from 'formik'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { Header, CustomButton } from '../../components'
import { tokens } from '../../theme'
import {
  fetchAllCommodities,
  fetchAllCategories,
  addCommodity,
  modifyCommodity,
  deleteCommodity,
  onCommodity,
  offCommodity,
  offCommodities,
  modifyCommoditiesCategory
} from '../../api'

// 添加/编辑 商品表单
const Form = ( { isAdd, row, handleFormSubmit, handleCancel, categories, selectedCategory, setSelectedCategory } ) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required( 'required' ),
    price: yup.string().required( 'required' ),
    image: yup.string().required( 'required' )
  })

  const initialValues = isAdd
  ?  {
    name: '',
    price: '',
    image: ''
  }
  : {
    name: row.name,
    price: row.price,
    image: row.image
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
              label='商品名称'
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
              label='商品价格'
              name='price'
              value={ values.price }
              fullWidth
              helperText={ touched.price && errors.price }
              error={ !!touched.price && !!errors.price }
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

            <TextField
              type='text'
              variant='filled'
              label='商品图片地址'
              name='image'
              value={ values.image }
              fullWidth
              helperText={ touched.image && errors.image }
              error={ !!touched.image && !!errors.image }
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

            <FormControl variant='filled' fullWidth>
              <InputLabel id="demo-simple-select-label">商品类型</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ selectedCategory }
                onChange={ e => setSelectedCategory(e.target.value) }
              >
                { categories.map( item => (
                  <MenuItem key={ item } value={ item }>{ item }</MenuItem>
                ) ) }
              </Select>
            </FormControl>
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

const CommodityManagement = () => {
  const theme = useTheme()
  const colors = tokens( theme.palette.mode )

  // 勾选的行
  const [ selectedRows, setSelectedRows ] = useState( [] )

  // 当前点击的行
  const [ clickedRow, setClickedRow ] = useState( {} )

  // 商品列表
  const [ commodities, setCommodities ] = useState( [] )

  // 商品类型列表
  const [ categories, setCategories ] = useState( [] )
  const [categoryNames, setCategoryNames] = useState([])

  // 添加/编辑商品相关参数
  const [isAdd, setIsAdd] = useState(true)
  const [addOrEditCommodityOpen, setAddOrEditCommodityOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  // 批量下架相关参数
  const [ offCommoditiesOpen, setOffCommoditiesOpen ] = useState( false )

  // 批量设置分类相关参数
  const [ modifyCategoriesOpen, setModifyCategoriesOpen ] = useState( false )
  const [ newCategory, setNewCategory ] = useState( '' )

  // 删除商品相关参数
  const [ deleteCommodityOpen, setDeleteCommodityOpen ] = useState( false )

  // 请求商品列表数据
  useEffect(() => {
    fetchAllCommodities().then(res => setCommodities(res.data.data))
  }, [])

  // 请求商品分类列表数据
  useEffect(() => {
    fetchAllCategories().then(res => {
      const data = res.data.data
      const names = data.map(item => item.name)
      setCategories(data)
      setCategoryNames(names)
      setSelectedCategory(names[0])
    })
  }, [])

  // 点击添加按钮
  const handleClickAdd = () => {
    setIsAdd(true)
    setAddOrEditCommodityOpen(true)
  }

  // 添加商品
  const handleAddCommodity = e => {
    const {name, price, image} = e
    let isExist = false
    commodities.forEach(item => {
      if (item.name === name) {
        isExist = true
      }
    })

    if (isExist) {
      toast.error('该名称已被使用')
      return false
    }

    const category = categories.find(item => item.name === selectedCategory)

    addCommodity({name, price, image, category_id: category._id})
      .then(res => {
        let newCommodity = res.data.data
        newCommodity.category = category
        setCommodities([newCommodity, ...commodities])
        setAddOrEditCommodityOpen(false)
        setSelectedCategory('')
        toast.success('添加成功')
      })
  }

  // 点击编辑按钮
  const handleClickEdit = category => {
    setIsAdd(false)
    setSelectedCategory(category)
    setAddOrEditCommodityOpen(true)
  }

  // 编辑商品
  const handleEditCommodity = e => {
    const {name, price, image} = e
    let isExist = false
    commodities.forEach(item => {
      if (item.name === name && item._id !== clickedRow._id) {
        isExist = true
      }
    })

    if (isExist) {
      toast.error('该名称已被使用')
      return false
    }

    const category = categories.find(item => item.name === selectedCategory)

    modifyCommodity({name, price, image, category_id: category._id, id: clickedRow._id})
      .then(() => {
        const newCommodities = commodities.map(item => item._id === clickedRow._id ? {...item, name, price, image, category} : item)
        setCommodities(newCommodities)
        setAddOrEditCommodityOpen(false)
        setSelectedCategory('')
        toast.success('编辑成功')
      })
  }

  // 删除商品
  const handleDeleteCommodity = () => {
    deleteCommodity(clickedRow._id)
      .then(() => {
        const newCommodities = commodities.filter(item => item._id !== clickedRow._id)
        setCommodities(newCommodities)
        setDeleteCommodityOpen(false)
        setClickedRow({})
        toast.success('删除成功')
      })
  }

  // 切换商品上架状态
  const handleStatusSwitch = (id, status) => {
    if (status === 'on') {
      offCommodity(id)
        .then(() => {
          const newCommodities = commodities.map(item => item._id === id ? {...item, status: 'off'} : item)
          setCommodities(newCommodities)
          toast.success('下架成功')
        })
    } else {
      onCommodity(id)
        .then(() => {
          const newCommodities = commodities.map(item => item._id === id ? {...item, status: 'on'} : item)
          setCommodities(newCommodities)
          toast.success('上架成功')
        })
    }
  }

  // 批量下架商品
  const handleOffCommodities = () => {
    offCommodities({idList: selectedRows})
      .then(() => {
        const newCommodities = commodities.map(item => selectedRows.includes(item._id) ? {...item, status: 'off'} : item)
        setCommodities(newCommodities)
        setOffCommoditiesOpen(false)
        setSelectedRows([])
        toast.success('下架成功')
      })
  }

  // 批量设置分类
  const handleModifyCategories = () => {
    modifyCommoditiesCategory({idList: selectedRows, category_id: newCategory._id})
      .then(() => {
        const newCommodities = commodities.map(item => {
          return selectedRows.includes(item._id)
          ? {...item, category: newCategory}
          : item
        })

        setCommodities(newCommodities)
        setModifyCategoriesOpen(false)
        setSelectedRows([])
        toast.success('设置成功')
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
    {
      field: 'category',
      headerName: '商品类型',
      renderCell: ( { row: { category } } ) => (
        <Box
          display='flex'
          justifyContent='center'
          width='50%'
          m='0 auto'
          p='5px'
        >
          {category.name}
        </Box>
      )
    },
    { field: 'price', headerName: '商品售价（元）'},
    { field: 'sales', headerName: '销量'},
    {
      field: 'status',
      headerName: '上架状态',
      flex: 0.5,
      renderCell: ( { row: { _id, status } } ) => (
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
            onChange={ () => handleStatusSwitch( _id, status ) }
          />
        </Box>
      )
    },
    {
      field: 'operations',
      headerName: '操作',
      flex: 1,
      renderCell: ({row: {category}}) => (
        <Box
          display='flex'
          justifyContent='center'
          gap='10px'
          width='80%'
          m='0 auto'
          p='5px'
        >
          <CustomButton colors={ colors } text='编辑' handleClick={ () => handleClickEdit(category.name) } />
          <CustomButton colors={ colors } text='删除' handleClick={ () => setDeleteCommodityOpen( true ) } />
        </Box>
      )
    }
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
        <CustomButton colors={ colors } text='添加商品' handleClick={handleClickAdd} />
        <CustomButton colors={ colors } text='批量下架' handleClick={ () => !selectedRows.length ? toast.error( '请选择要下架的商品' ) : setOffCommoditiesOpen( true ) } />
        <CustomButton colors={ colors } text='批量设置分类' handleClick={ () => !selectedRows.length ? toast.error( '请选择要设置分类的商品' ) : setModifyCategoriesOpen( true ) } />
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Header title='商品管理' subtitle='管理所有商品' />

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
          rowSelectionModel={ selectedRows }
          onRowSelectionModelChange={ id => setSelectedRows( id ) }
          onRowClick={ e => setClickedRow( e.row ) }
        />
      </Box>

      {/* ADD / EDIT COMMODITY MODAL */}
      <Modal
        open={addOrEditCommodityOpen}
        onClose={ () => setAddOrEditCommodityOpen(false) }
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
            { isAdd ? '添加' : '编辑' }商品
          </Typography>

          <Box id='modal-modal-description'>
            <Form
              isAdd={ isAdd }
              row={ clickedRow }
              categories={ categoryNames }
              selectedCategory={ selectedCategory }
              setSelectedCategory={ setSelectedCategory }
              handleFormSubmit={ isAdd ? handleAddCommodity : handleEditCommodity }
              handleCancel={ () => setAddOrEditCommodityOpen(false) }
            />
          </Box>
        </Box>
      </Modal>

      {/* OFF COMMODITIES MODAL */}
      <Modal
        open={ offCommoditiesOpen }
        onClose={ () => setOffCommoditiesOpen( false ) }
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
            <Typography sx={{ textAlign: 'center' }}>确认下架选中的所有商品吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setOffCommoditiesOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleOffCommodities }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* MODIFY CATEGORY MODAL */}
      <Modal
        open={ modifyCategoriesOpen }
        onClose={ () => setModifyCategoriesOpen( false ) }
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
            批量设置分类
          </Typography>

          <Box id='modal-modal-description'>
            <FormControl variant='filled' fullWidth>
              <InputLabel id="demo-simple-select-label">商品类型</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ newCategory }
                onChange={ e => setNewCategory( e.target.value ) }
              >
                { categories.map( item => (
                  <MenuItem key={ item._id } value={ item }>{ item.name }</MenuItem>
                ) ) }
              </Select>
            </FormControl>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setModifyCategoriesOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleModifyCategories }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* DELETE COMMODITY MODAL */}
      <Modal
        open={ deleteCommodityOpen }
        onClose={ () => setDeleteCommodityOpen( false ) }
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
            <Typography sx={{ textAlign: 'center' }}>确认删除当前商品吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteCommodityOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteCommodity }
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

export default CommodityManagement