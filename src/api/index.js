import axios from 'axios'

const API = axios.create({baseURL: 'http://localhost:4000/api/v1'})

// 登录
export const login = data => API.post('/auth/login/web', data)

// 成员管理
export const fetchAllMembers = () => API.get('/member/web')
export const addMember = data => API.post('/member/web', data)
export const editMember = data => API.patch('/member/web', data)
export const modifyMembersRole = data => API.patch('/member/web', data)
export const deleteMember = id => API.delete(`/member/web/${id}`)
export const deleteMembers = data => API.delete('/member/web', {params: {idList: data}})

// 用户管理
export const fetchAllUsers = () => API.get('/user/web')
export const giveVip = data => API.patch('/user/web/vip', data)
export const giveCoupon = data => API.patch('/user/web/coupon', data)
export const fetchAllGroups = () => API.get('/group/web')
export const setUsersGroup = data => API.patch('/user/web/group', data)
export const fetchAllOnCoupons = () => API.get('/coupon/web')

// 用户分组
export const modifyGroup = data => API.patch('/group/web', data)
export const addGroup = data => API.post('/group/web', data)
export const deleteGroup = id => API.delete(`/group/web/${id}`)
export const deleteGroups = data => API.delete('/group/web', {params: {idList: data}})

// 商品分类
export const fetchAllCategories = () => API.get('/category/web')
export const addCategory = data => API.post('/category/web', data)
export const modifyCategory = data => API.patch('/category/web', data)
export const deleteCategory = id => API.delete(`/category/web/${id}`)
export const deleteCategories = data => API.delete('/category/web', {params: {idList: data}})
export const onCategory = id => API.patch(`/category/web/on/${id}`)
export const offCategory = id => API.patch(`/category/web/off/${id}`)

// 商品管理
export const fetchAllCommodities = () => API.get('/commodity/web')
export const addCommodity = data => API.post('/commodity/web', data)
export const modifyCommodity = data => API.patch('/commodity/web', data)
export const deleteCommodity = id => API.delete(`/commodity/web/${id}`)
export const onCommodity = id => API.patch(`/commodity/web/on/${id}`)
export const offCommodity = id => API.patch(`/commodity/web/off_single/${id}`)
export const offCommodities = data => API.patch('/commodity/web/off_multiple', data)
export const modifyCommoditiesCategory = data => API.patch('/commodity/web/category', data)

// 商品统计
export const fetchAllCommoditiesData = (startDate, endDate) => API.get(`/commodity/web/data?startDate=${startDate}&endDate=${endDate}`)

// 订单管理
export const fetchAllOrders = () => API.get('/order/web')
export const deleteOrder = id => API.delete(`/order/web/${id}`)
export const deleteOrders = data => API.delete('/order/web', {params: {idList: data}})
export const doneOrder = id => API.patch(`/order/web/${id}`)

// 订单统计
export const fetchNearest7DaysOrderData = () => API.get('/order/web/data')

// 优惠券管理
export const fetchAllCoupons = () => API.get('/coupon/web')
export const onCoupon = id => API.patch(`/coupon/web/on/${id}`)
export const offCoupon = id => API.patch(`/coupon/web/off_single/${id}`)
export const offCoupons = data => API.patch('/coupon/web/off_multiple', data)
export const addCoupon = data => API.post('/coupon/web', data)
export const editCoupon = data => API.patch('/coupon/web', data)
export const deleteCoupon = id => API.delete(`/coupon/web/${id}`)
