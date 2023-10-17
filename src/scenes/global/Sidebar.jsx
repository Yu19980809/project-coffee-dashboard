import { useState, useEffect } from 'react'
import { Sidebar, SubMenu, Menu, MenuItem } from 'react-pro-sidebar'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined'
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined'
import { tokens } from '../../theme'
import { logo } from '../../assets/images'

const Item = ( { colors, title, to, icon, selected, setSelected } ) => (
  <MenuItem
    icon={ icon }
    component={ <Link to={ to } /> }
    style={{ color: colors.grey[100], backgroundColor: 'transparent' }}
    active={ selected === title }
    onClick={ () => setSelected( title ) }
  >
    <Typography>{ title }</Typography>
  </MenuItem>
)

const SideBar = () => {
  const theme = useTheme()
  const colors = tokens( theme.palette.mode )
  const [user, setUser] = useState({})
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userInfo')))
  }, [])

  const [ isCollapsed, setIsCollapsed ] = useState( false )
  const [ selected, setSelected ] = useState( 'Dashboard' )

  return (
    <Box
      sx={{
        '& .ps-sidebar-root': { height: '100vh' },
        '& .ps-sidebar-container': { background: `${ colors.primary[400] } !important` },
        '& .ps-submenu-content': { background: `${ colors.primary[400] } !important` },
        '& .ps-submenu-content .ps-menu-button': { paddingLeft: '65px !important' },
        '& .ps-menu-button': { padding: '5px 35px 5px 20px !important' },
        '& .ps-menu-button:hover': { color: '#868dfd !important', backgroundColor: 'transparent !important' },
        '& .ps-active': { color: '#6870fa !important' }
      }}
    >
      <Sidebar collapsed={ isCollapsed }>
        <Menu>
          {/* LOGO & MENU ICON */}
          <MenuItem
            icon={ isCollapsed ? <MenuOutlinedIcon /> : undefined }
            style={{ margin: '10px 0 20px 0', color: colors.grey[100] }}
            onClick={ () => setIsCollapsed( !isCollapsed ) }
          >
            { !isCollapsed && (
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                ml='15px'
              >
                <Typography variant='h4' color={ colors.grey[100] }>
                  CodeDreamer
                </Typography>

                <IconButton>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            ) }
          </MenuItem>

          {/* USER */}
          { !isCollapsed && (
            <Box mb='25px'>
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <img
                  src={ logo }
                  alt='profile-user'
                  width='100px'
                  height='100px'
                  style={{ borderRadius: '50%', cursor: 'pointer' }}
                />
              </Box>

              <Box textAlign='center'>
                <Typography
                  variant='h3'
                  fontWeight='bold'
                  color={ colors.grey[100] }
                  sx={{ m: '10px 0' }}
                >
                  { user?.name }
                </Typography>

                <Typography
                  variant='h5'
                  color={ colors.greenAccent[500] }
                >
                  { user?.role === 'salesclerk' ? '店员' : '经理' }
                </Typography>
              </Box>
            </Box>
          ) }

          {/* MENU ITEMS */}
          <Box paddingLeft={ isCollapsed ? undefined : '5%' }>
            <Item
              title='主页'
              to='/'
              icon={ <HomeOutlinedIcon /> }
              colors={ colors }
              selected={ selected }
              setSelected={ setSelected }
            />

            <SubMenu label='用户' icon={ <PersonOutlinedIcon /> }>
              <Item
                title='团队管理'
                to='/user/team'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />

              <Item
                title='用户管理'
                to='/user/management'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />

              <Item
                title='用户分组'
                to='/user/group'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />
            </SubMenu>

            <SubMenu label='订单' icon={ <ListAltOutlinedIcon /> }>
              <Item
                title='订单管理'
                to='/order/management'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />

              <Item
                title='订单统计'
                to='/order/statistics'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />
            </SubMenu>
            
            <SubMenu label='商品' icon={ <LocalCafeOutlinedIcon /> }>
              <Item
                title='商品管理'
                to='/commodity/management'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />

              <Item
                title='商品分类'
                to='/commodity/classification'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />

              <Item
                title='商品统计'
                to='/commodity/statistics'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />
            </SubMenu>

            <SubMenu label='营销' icon={ <CelebrationOutlinedIcon /> }>
              <Item
                title='优惠券管理'
                to='/coupon/management'
                colors={ colors }
                selected={ selected }
                setSelected={ setSelected }
              />
            </SubMenu>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  )
}

export default SideBar