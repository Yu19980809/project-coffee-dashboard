import { useState, useEffect } from 'react'
import {
  Box,
  Switch,
  Modal,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme
} from '@mui/material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { Header, CustomButton } from '../../components'
import { tokens } from '../../theme'
import { categoryTypes } from '../../constants'
import {
  fetchAllCategories,
  addCategory,
  modifyCategory,
  deleteCategory,
  deleteCategories,
  offCategory,
  onCategory
} from '../../api'

const CommodityClassification= () => {
  const theme = useTheme()
  const colors = tokens( theme.palette.mode )

  // 勾选的行
  const [ selectedRows, setSelectedRows ] = useState( [] )

  // 当前点击的行
  const [ clickedRow, setClickedRow ] = useState( {} )

  // 分类列表
  const [ categories, setCategories ] = useState( [] )

  // 添加/编辑分类相关参数
  const [isAdd, setIsAdd] = useState(true)
  const [ addOrEditCategoryOpen, setAddOrEditCategoryOpen ] = useState( false )
  const [ categoryName, setCategoryName ] = useState( '' )
  const [selectedType, setSelectedType] = useState('')

  // 删除单个分类相关参数
  const [ deleteSingleCategoryOpen, setDeleteSingleCategoryOpen ] = useState( false )

  // 批量删除分类相关参数
  const [ deleteCategoriesOpen, setDeleteCategoriesOpen ] = useState( false )

  // 请求分类列表数据
  useEffect(() => {
    fetchAllCategories().then(res => setCategories(res.data.data))
  }, [])

  // 点击添加按钮
  const handleClickAdd = () => {
    setIsAdd(true)
    setAddOrEditCategoryOpen(true)
    setSelectedType('')
    setCategoryName('')
  }

  // 添加分类
  const handleAddCategory = () => {
    let isExist = false
    categories.forEach(item => {
      if (item.name === categoryName) {
        isExist = true
      }
    })

    if (isExist) {
      toast.error('该分类已存在')
      setAddOrEditCategoryOpen(false)
      setCategoryName('')
      setSelectedType('')
    } else {
      addCategory({name: categoryName, type: selectedType})
        .then(res => {
          setCategories([res.data.data, ...categories])
          setAddOrEditCategoryOpen(false)
          setCategoryName('')
          setSelectedType('')
          toast.success('添加成功')
        })
    }

    
  }

  // 点击编辑按钮
  const handleClickEdit = (type, name) => {
    setIsAdd(false)
    setAddOrEditCategoryOpen(true)
    setSelectedType(type)
    setCategoryName(name)
  }

  // 编辑分类
  const handleEditCategory = () => {
    let isExist = false
    categories.forEach(item => {
      if (item.name === categoryName && item._id !== clickedRow._id) {
        isExist = true
      }
    })

    if (isExist) {
      setAddOrEditCategoryOpen(false)
      setClickedRow({})
      toast.error('该名称已被使用')
    } else {
      modifyCategory({categoryId: clickedRow._id, newName: categoryName, newType: selectedType})
        .then(() => {
          const newCategories = categories.map(
            item => item._id === clickedRow._id
            ? {...item, name: categoryName, type: selectedType}
            : item
          )

          setCategories(newCategories)
          setAddOrEditCategoryOpen(false)
          setSelectedType('')
          setClickedRow({})
          toast.success('修改成功')
        })
    }
  }

  // 删除单个分类
  const handleDeleteSingleCategory = () => {
    deleteCategory(clickedRow._id)
      .then(() => {
        const newCategories = categories.filter(item => item._id !== clickedRow._id)
        setCategories(newCategories)
        setDeleteSingleCategoryOpen(false)
        setClickedRow({})
        toast.success('删除成功')
      })
  }

  // 批量删除分类
  const handleDeleteCategories = () => {
    deleteCategories(selectedRows)
      .then(() => {
        const newCategories = categories.filter(item => !selectedRows.includes(item._id))
        setCategories(newCategories)
        setDeleteCategoriesOpen(false)
        setSelectedRows([])
        toast.success('删除成功')
      })
  }

  // 切换显示状态
  const handleSwitchStatus = (id, status) => {
    if (status === 'on') {
      offCategory(id)
        .then(() => {
          const newCategories = categories.map(item => item._id === id ? {...item, status: 'off'} : item)
          setCategories(newCategories)
          toast.success('下架成功')
        })
    } else {
      onCategory(id)
        .then(() => {
          const newCategories = categories.map(item => item._id === id ? {...item, status: 'on'} : item)
          setCategories(newCategories)
          toast.success('上架成功')
        })
    }
  }

  // 表格相关参数
  const columns = [
    { field: 'name', headerName: '分类名称', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'commodity_count', headerName: '商品数量'},
    { field: 'type', headerName: '类型', flex: 1 },
    {
      field: 'status',
      headerName: '显示状态',
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
            onChange={ () => handleSwitchStatus(_id, status) }
          />
        </Box>
      )
    },
    {
      field: 'operations',
      headerName: '操作',
      flex: 1,
      renderCell: ({row: {type, name}}) => (
        <Box
          display='flex'
          justifyContent='center'
          gap='10px'
          width='80%'
          m='0 auto'
          p='5px'
        >
          <CustomButton colors={ colors } text='编辑' handleClick={() => handleClickEdit(type, name)} />
          <CustomButton colors={ colors } text='删除' handleClick={ () => setDeleteSingleCategoryOpen( true ) } />
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
        <CustomButton colors={ colors } text='添加分类' handleClick={handleClickAdd} />
        <CustomButton colors={ colors } text='批量删除分类' handleClick={ () => !selectedRows.length ? toast.error( '请选择要删除的分类' ) : setDeleteCategoriesOpen( true ) } />
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Header title='商品分类' subtitle='商品分类信息' />

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
          rows={ categories }
          getRowId={ row => row._id }
          columns={ columns }
          components={{ Toolbar: CustomToolbar }}
          rowSelectionModel={ selectedRows }
          onRowSelectionModelChange={ id => setSelectedRows( id ) }
          onRowClick={ e => setClickedRow( e.row ) }
        />
      </Box>

      {/* ADD/EDIT CATEGORY MODAL */}
      <Modal
        open={ addOrEditCategoryOpen }
        onClose={ () => setAddOrEditCategoryOpen( false ) }
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
            {isAdd ? '添加分类' : '编辑分类'}
          </Typography>

          <Box id='modal-modal-description'>
            <TextField
              id="filled-basic"
              label="名称"
              variant="filled"
              fullWidth
              value={ categoryName }
              onChange={ e => setCategoryName( e.target.value ) }
            />

            <FormControl variant='filled' fullWidth sx={{ marginTop: '10px' }}>
              <InputLabel id="demo-simple-select-label">类型</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ selectedType }
                onChange={ e => setSelectedType( e.target.value ) }
              >
                { categoryTypes.map( item => (
                  <MenuItem key={ item.name } value={ item.name }>{ item.name }</MenuItem>
                ) ) }
              </Select>
            </FormControl>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setAddOrEditCategoryOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ isAdd ? handleAddCategory : handleEditCategory }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* DELETE SINGLE CATEGORY MODAL */}
      <Modal
        open={ deleteSingleCategoryOpen }
        onClose={ () => setDeleteSingleCategoryOpen( false ) }
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
            <Typography sx={{ textAlign: 'center' }}>删除该分类会导致该分类下的所有商品也被删除</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteSingleCategoryOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteSingleCategory }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* DELETE GROUPS MODAL */}
      <Modal
        open={ deleteCategoriesOpen }
        onClose={ () => setDeleteCategoriesOpen( false ) }
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
            <Typography sx={{ textAlign: 'center' }}>删除分类会导致该分类下的所有商品也被删除</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteCategoriesOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteCategories }
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

export default CommodityClassification