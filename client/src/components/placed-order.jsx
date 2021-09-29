import React from 'react'
import { Text, Button, Card, zmp } from 'zmp-framework/react'
import store from '../store'
import { Price } from './prices'
import '../css/discount.scss'

const PlacedOrder = ({ order }) => {
  const { cart, created_at, discount, total, shipping, shop, address, name, phone } = order

  const reOrder = () => {
    zmp.views.main.router.navigate('/')
    store.dispatch('reOrder', order)
  }

  return (
    <Card className="discount-card" inset>
      <img className="discount-image" src={cart[0].image} />
      <div className="discount-summary">
        <Text className="text-secondary">
          {new Date(created_at).toLocaleDateString()} - {new Date(created_at).toLocaleTimeString()}
        </Text>
        {shipping ?
          (address && <>
            <Text bold>{name} - {phone}</Text>
            <Text>{address}</Text></>
          ) :
          <Text bold>{shop}</Text>
        }
        <div className="d-flex">
          <Price bold amount={total} />
          {discount && <Text className="text-secondary">&nbsp;- {discount}</Text>}
        </div>
        <Button fill responsive onClick={reOrder}>Đặt lại</Button>
      </div>
    </Card>
  )
}

PlacedOrder.displayName = 'zmp-placed-order'

export default PlacedOrder
