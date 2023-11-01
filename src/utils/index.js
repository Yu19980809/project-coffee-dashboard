// 处理订单统计表格数据
export const formatOrderData = data => {
  let orderData = [
    {
      'id': '订单量',
      'color': 'hsl(149, 70%, 50%)',
      'data': []
    },
    {
      'id': '销售额',
      'color': 'hsl(64, 70%, 50%)',
      'data': []
    }
  ]

  for (let i = 0; i < 7; i++) {
    const iData = data[i]
    orderData[0]['data'].push({x: iData.date, y: iData.count})
    orderData[1]['data'].push({x: iData.date, y: iData.price})
  }

  return orderData
}
