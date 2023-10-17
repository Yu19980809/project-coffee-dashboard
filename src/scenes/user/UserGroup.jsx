import { useState, useEffect } from 'react'
import { Box, Modal, TextField, Typography, Button, useTheme } from '@mui/material'
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport  } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import { Header, CustomButton } from '../../components'
import { tokens } from '../../theme'
import { fetchAllGroups, modifyGroup, addGroup, deleteGroup, deleteGroups } from '../../api'

const UserGroup = () => {
  const theme = useTheme()
  const colors = tokens( theme.palette.mode )

  // 选中的行
  const [ selectedRows, setSelectedRows ] = useState( [] )

  // 当前点击的行
  const [ clickedRow, setClickedRow ] = useState( {} )

  // 分组列表
  const [ groups, setGroups ] = useState( [] )

  // 请求分组列表数据
  useEffect(() => {
    fetchAllGroups().then(res => setGroups(res.data.data))
  }, [])

  // 修改分组相关参数
  const [ modifyGroupOpen, setModifyGroupOpen ] = useState( false )
  const [ newGroupName, setNewGroupName ] = useState( '' )

  // 修改分组
  const handleModifyGroup = () => {
    modifyGroup({groupId: clickedRow._id, newName: newGroupName})
      .then(() => {
        const newGroups = groups.map(item => item._id === clickedRow._id ? {...item, name: newGroupName} : item)
        setModifyGroupOpen(false)
        setGroups(newGroups)
        setNewGroupName('')
        setClickedRow({})
        toast.success('修改成功')
      })
  }

  // 添加分组相关参数
  const [ addGroupOpen, setAddGroupOpen ] = useState( false )
  const [ addGroupName, setAddGroupName ] = useState( '' )

  // 添加分组
  const handleAddGroup = () => {
    addGroup({name: addGroupName})
      .then(res => {
        setAddGroupOpen(false)
        setGroups([res.data.data, ...groups])
        setAddGroupName('')
        toast.success('添加成功')
      })
  }

  // 删除（单个）分组相关参数
  const [ deleteSingleGroupOpen, setDeleteSingleGroupOpen ] = useState( false )

  // 删除（单个）分组
  const handleDeleteSingleGroup = () => {
    deleteGroup(clickedRow._id)
      .then(() => {
        const newGroups = groups.filter(item => item._id !== clickedRow._id)
        setDeleteSingleGroupOpen(false)
        setGroups(newGroups)
        toast.success('删除成功')
      })
  }

  // 批量删除分组相关参数
  const [ deleteGroupsOpen, setDeleteGroupsOpen ] = useState( false )

  // 批量删除分组
  const handleDeleteGroups = () => {
    deleteGroups(selectedRows)
      .then(() => {
        const newGroups = groups.filter(item => !selectedRows.includes(item._id))
        setDeleteGroupsOpen(false)
        setGroups(newGroups)
        setSelectedRows([])
        toast.success('删除成功')
      })
  }

  // 表格相关参数
  const columns = [
    { field: 'name', headerName: '分组名称', flex: 1, cellClassName: 'name-column--cell' },
    { field: 'user_count', headerName: '组内用户数量', flex: 0.5 },
    {
      field: 'operations',
      headerName: '操作',
      flex: 0.5,
      renderCell: () => (
        <Box
          display='flex'
          gap='10px'
          width='50%'
          p='5px'
        >
          <CustomButton colors={ colors } text='修改' handleClick={ () => setModifyGroupOpen( true ) } />
          <CustomButton colors={ colors } text='删除' handleClick={ () => setDeleteSingleGroupOpen( true ) } />
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
        <CustomButton colors={ colors } text='添加分组' handleClick={ () => setAddGroupOpen( true ) } />
        <CustomButton colors={ colors } text='批量删除分组' handleClick={ () => !selectedRows.length ? toast.error( '请选择要删除的分组' ) : setDeleteGroupsOpen( true ) } />
      </Box>
    </GridToolbarContainer>
  )

  return (
    <Box m='20px'>
      {/* HEADER */}
      <Header title='用户分组' subtitle='管理用户分组' />

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
          rows={ groups }
          getRowId={ row => row._id }
          columns={ columns }
          components={{ Toolbar: CustomToolbar }}
          rowSelectionModel={ selectedRows }
          onRowSelectionModelChange={ id => setSelectedRows( id ) }
          onRowClick={ e => setClickedRow( e.row ) }
        />
      </Box>

      {/* MODIFY GROUP MODAL */}
      <Modal
        open={ modifyGroupOpen }
        onClose={ () => setModifyGroupOpen( false ) }
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
            修改分组名称
          </Typography>

          <Box id='modal-modal-description'>
            <TextField
              id="filled-basic"
              label="名称"
              variant="filled"
              fullWidth
              value={ newGroupName }
              onChange={ e => setNewGroupName( e.target.value ) }
            />

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setModifyGroupOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleModifyGroup }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* ADD GROUP MODAL */}
      <Modal
        open={ addGroupOpen }
        onClose={ () => setAddGroupOpen( false ) }
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
            添加分组
          </Typography>

          <Box id='modal-modal-description'>
            <TextField
              id="filled-basic"
              label="名称"
              variant="filled"
              fullWidth
              value={ addGroupName }
              onChange={ e => setAddGroupName( e.target.value ) }
            />

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setAddGroupOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleAddGroup }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* DELETE SINGLE GROUP MODAL */}
      <Modal
        open={ deleteSingleGroupOpen }
        onClose={ () => setDeleteSingleGroupOpen( false ) }
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
            <Typography sx={{ textAlign: 'center' }}>确认删除该分组吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteSingleGroupOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteSingleGroup }
              >
                确认
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* DELETE GROUPS MODAL */}
      <Modal
        open={ deleteGroupsOpen }
        onClose={ () => setDeleteGroupsOpen( false ) }
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
            <Typography sx={{ textAlign: 'center' }}>确认删除选中的所有分组吗？</Typography>

            <Box display='flex' justifyContent='center' gap='20px' mt='20px'>
              <Button
                type='button'
                variant='contained'
                color='primary'
                onClick={ () => setDeleteGroupsOpen( false ) }
              >
                取消
              </Button>

              <Button
                type='button'
                variant='contained'
                color='secondary'
                onClick={ handleDeleteGroups }
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

export default UserGroup