import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
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
import { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined'
import { Header, CustomButton } from '../../components'
import { tokens } from '../../theme'
import {
  fetchAllMembers,
  addMember,
  editMember,
  deleteMember,
  deleteMembers
} from '../../api'

// 添加/编辑成员表单
const Form = ( { row, isAdd, setAddOrEditMemberOpen, handleFormSubmit } ) => {
  const phoneRegExp = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/

  const validationSchema = yup.object().shape({
    name: yup.string().required( 'required' ),
    tel: yup.string()
      .matches( phoneRegExp, 'Phone number is not valid' )
      .required( 'required' ),
    address: yup.string().required( 'required' ),
    password: yup.string().required( 'required' ),
    confirmPassword: yup.string().required( 'required' )
  })
  
  const initialValues = isAdd
  ? {
    name: '',
    tel: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: 'salesclerk'
  }
  : {
    name: row.name,
    tel: row.tel,
    address: row.address,
    password: row.password,
    confirmPassword: row.password,
    role: row.role
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
            display='grid'
            gap='30px'
            gridTemplateColumns='repeat( 4, minmax( 0, 1fr ) )'
            sx={{ '& > div': 'span 4' }}
          >
            <TextField
              type='text'
              variant='filled'
              label='姓名'
              name='name'
              value={ values.name }
              fullWidth
              helperText={ touched.name && errors.name }
              error={ !!touched.name && !!errors.name }
              sx={{ gridColumn: 'span 4', flex: 1 }}
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

            <TextField
              type='text'
              variant='filled'
              label='电话'
              name='tel'
              value={ values.tel }
              fullWidth
              helperText={ touched.tel && errors.tel }
              error={ !!touched.tel && !!errors.tel }
              sx={{ gridColumn: 'span 4' }}
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

            <TextField
              type='text'
              variant='filled'
              label='住址'
              name='address'
              value={ values.address }
              fullWidth
              helperText={ touched.address && errors.address }
              error={ !!touched.address && !!errors.address }
              sx={{ gridColumn: 'span 4' }}
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

            <TextField
              type='text'
              variant='filled'
              label='密码'
              name='password'
              value={ values.password }
              fullWidth
              helperText={ touched.password && errors.password }
              error={ !!touched.password && !!errors.password }
              sx={{ gridColumn: 'span 4' }}
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

            <TextField
              type='text'
              variant='filled'
              label='确认密码'
              name='confirmPassword'
              value={ values.confirmPassword }
              fullWidth
              helperText={ touched.confirmPassword && errors.confirmPassword }
              error={ !!touched.confirmPassword && !!errors.confirmPassword }
              sx={{ gridColumn: 'span 4' }}
              onChange={ handleChange }
              onBlur={ handleBlur }
            />

          </Box>

          <RadioGroup
            row
            name='role'
            defaultValue={initialValues.role}
            sx={{ marginTop: '30px' }}
          >
            <FormControlLabel value="salesclerk" control={<Radio color='secondary' />} label="店员" />
            <FormControlLabel value="manager" control={<Radio color='secondary' />} label="经理" />
          </RadioGroup>

          <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
            <Button
              type='button'
              variant='contained'
              color='primary'
              onClick={() => setAddOrEditMemberOpen(false)}
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

const TeamManagement = () => {
  const theme = useTheme()
  const colors = tokens( theme.palette.mode )
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const columns = [
    { field: 'name', headerName: '姓名', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'tel', headerName: '电话', flex: 1 },
    { field: 'address', headerName: '住址', flex: 1.5 },
    {
      field: 'role',
      headerName: '身份',
      flex: 0.5,
      renderCell: ( { row: { role } } ) => (
        <Box
          display='flex'
          justifyContent='center'
          width='80%'
          p='5px'
          backgroundColor={
            role === 'manager'
              ? colors.greenAccent[600]
              : role === 'salesclerk'
              ? colors.greenAccent[700]
              : colors.greenAccent[700]
          }
          borderRadius='4px'
        >
          { role === 'manager' && <AdminPanelSettingsOutlinedIcon /> }
          { role === 'salesclerk' && <SecurityOutlinedIcon /> }

          <Typography color={ colors.grey[100] } sx={{ ml: '5px' }}>
            { role === 'manager' ? '经理' : role === 'salesclerk' ? '店员' : '店员' }
          </Typography>
        </Box>
      )
    },
    {
      field: 'operations',
      headerName: '操作',
      flex: 1,
      renderCell: () => (
        <Box
          display={userInfo.role === 'salesclerk' ? 'none' : 'flex'}
          justifyContent='center'
          gap='10px'
          width='80%'
          m='0 auto'
          p='5px'
        >
          <CustomButton colors={ colors } text='编辑' handleClick={handleClickEdit} />
          <CustomButton colors={ colors } text='删除' handleClick={ () => setDeleteMemberOpen( true ) } />
        </Box>
      )
    }
  ]

  // 添加/编辑成员相关参数
  const [isAdd, setIsAdd] = useState(true)
  const [ addOrEditMemberOpen, setAddOrEditMemberOpen ] = useState( false )
  const [ members, setMembers ] = useState( [] )
  const [ loading, setLoading ] = useState( false )

  // 选中的所有行
  const [ selectedRows, setSelectedRows ] = useState( [] )

  // 当前点击的行
  const [clickedRow, setClickedRow] = useState({})

  // 删除成员相关参数
  const [ deleteMemberOpen, setDeleteMemberOpen ] = useState( false )

  // 批量删除成员相关参数
  const [deleteMembersOpen, setDeleteMembersOpen] = useState(false)

  // 请求团队成员数据
  useEffect(() => {
    setLoading(true)
    fetchAllMembers()
      .then(res => {
        setLoading(false)
        setMembers(res.data.data)
      })
  }, [])

  // 添加/编辑成员
  const handleAddOrEditMember = e => {
    const {name, tel, address, password, role} = e

    if (isAdd) {
      addMember({name, tel, address, password, role, shopId: userInfo.shop_id})
      .then(res => {
        setAddOrEditMemberOpen(false)
        toast.success('添加成功')
        setMembers([res.data.data, ...members])
      })
    } else {
      editMember({id: clickedRow._id, name, tel, address, password, role})
      .then(() => {
        const newMembers = members.map(item => {
          if (item._id === clickedRow._id) {
            return {...item, name, tel, address, password, role}
          }

          return item
        })
        setMembers(newMembers)
        setAddOrEditMemberOpen(false)
        toast.success('编辑成功')
      })
    }
  }

  // 点击添加按钮
  const handleClickAdd = () => {
    setIsAdd(true)
    setAddOrEditMemberOpen(true)
  }

  // 点击编辑按钮
  const handleClickEdit = () => {
    setIsAdd(false)
    setAddOrEditMemberOpen(true)
  }

  // 删除（单个）成员
  const handleDeleteMember = () => {
    deleteMember(clickedRow._id)
      .then(() => {
        const newMembers = members.filter(item => item._id !== clickedRow._id)
        setDeleteMemberOpen(false)
        setMembers(newMembers)
        toast.success('删除成功')
      })
  }

  // 批量删除成员
  const handleDeleteMembers = () => {
    deleteMembers(selectedRows)
      .then(() => {
        const newMembers = members.filter(item => !selectedRows.includes(item._id))
        setDeleteMembersOpen(false)
        setMembers(newMembers)
        toast.success('删除成功')
      })
  }

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
        <CustomButton colors={ colors } text='添加成员' handleClick={handleClickAdd} />
        <CustomButton colors={ colors } text='批量删除成员' handleClick={ () => !selectedRows.length ? toast.error( '请选择要删除的成员' ) : setDeleteMembersOpen( true ) } />
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Header title='团队管理' subtitle='管理您的团队成员' />

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
          rows={ members }
          getRowId={ row => row._id }
          columns={ columns }
          columnVisibilityModel={{ operations: userInfo?.role !== 'salesclerk' }}
          components={{ Toolbar: CustomToolbar }}
          loading={ loading }
          rowSelectionModel={ selectedRows }
          onRowSelectionModelChange={ id => setSelectedRows( id ) }
          onRowClick={ e => setClickedRow( e.row ) }
        />
      </Box>

      {/* ADD/EDIT MEMBER MODAL */}
      <Modal
        open={ addOrEditMemberOpen }
        onClose={ () => setAddOrEditMemberOpen( false ) }
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
            {isAdd ? '添加成员' : '编辑成员信息'}
          </Typography>

          <Box id='modal-modal-description'>
            <Form
              row={clickedRow}
              isAdd={isAdd}
              setAddOrEditMemberOpen={setAddOrEditMemberOpen}
              handleFormSubmit={ handleAddOrEditMember }
            />
          </Box>
        </Box>
      </Modal>

      {/* DELETE SINGLE MEMBER MODAL */}
      <Modal
        open={ deleteMemberOpen }
        onClose={ () => setDeleteMemberOpen( false ) }
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
            删除成员
          </Typography>

          <Box id='modal-modal-description'>
            <Typography sx={{ textAlign: 'center' }}>确认删除当前成员吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteMemberOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteMember }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* DELETE MEMBERS MODAL */}
      <Modal
        open={ deleteMembersOpen }
        onClose={ () => setDeleteMembersOpen( false ) }
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
            删除成员
          </Typography>

          <Box id='modal-modal-description'>
            <Typography sx={{ textAlign: 'center' }}>确认删除选中的所有成员吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteMemberOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteMembers }
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

export default TeamManagement