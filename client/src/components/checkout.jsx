import React, { useEffect, useMemo, useState } from 'react';
import { Button, Text, Actions, ActionsGroup, ActionsLabel, List, ListItem, Icon, Box, Avatar, Input, useStore, Link, Checkbox, zmp } from 'zmp-framework/react';
import ProductImage from './product-image'
import shop from '../../assets-src/shop.svg'
import clock from '../../assets-src/clock.svg'
import phone from '../../assets-src/phone.svg'
import note from '../../assets-src/note.svg'
import { Price } from './prices';
import ProductOrder from './product-order';
import store from '../store';

const Checkout = ({ value, onChange, children, onReturn }) => {
  const showCheckout = useStore('showCheckout')
  const setShowCheckout = (value) => {
    store.dispatch('setShowCheckout', value)
  }
  const selectedShop = useStore('selectedShop')
  const cart = useStore('cart')
  const totalAmount = useStore('totalAmount')

  const [show, setShow] = useState(false)
  useEffect(() => setShow(showCheckout), [showCheckout])

  const selectedDiscount = useStore('selectedDiscount')
  const showDiscounts = () => {
    zmp.views.main.router.navigate('/discount')
    setShowCheckout(false)
  }

  return (
    <>
      <div onClick={() => setShowCheckout(true)}>{children}</div>
      <Actions
        opened={show}
        onActionsClosed={() => setShowCheckout(false)}
        onActionsClose={() => {
          if (onReturn) {
            onReturn()
          }
        }}
      >
        <ActionsGroup className="address-picker-actions">
          <Button typeName="ghost" className="close-button" onClick={() => setShowCheckout(false)}>
            <Icon zmp="zi-arrow-left" size={24}></Icon>
          </Button>
          <ActionsLabel bold>
            <span className="title">Xác nhận đơn hàng</span>
          </ActionsLabel>
          <ActionsLabel className="p-0">
            <Box style={{ textAlign: 'left' }}><Text bold>Tự đến lấy tại</Text></Box>
            <List className="my-0">
              <ListItem>
                <Avatar slot="media" src={shop} size="24" />
                <Icon slot="content" zmp="zi-chevron-right" />
                <Box style={{ textAlign: 'left' }}>
                  <Text bold fontSize="16">{selectedShop.name}</Text>
                  <Text className="text-secondary">{selectedShop.address}</Text>
                </Box>
              </ListItem>
            </List>
          </ActionsLabel>
          <ActionsLabel className="p-0">
            <Box style={{ textAlign: 'left' }}><Text bold>Thông tin khách hàng</Text></Box>
            <List className="my-0">
              <ListItem>
                <Box slot="root-start" style={{ textAlign: 'left', marginLeft: 16, marginBottom: -8, marginTop: 0, paddingTop: 16 }}>Thời gian nhận hàng</Box>
                <Avatar slot="media" src={clock} size="24" />
                <Icon slot="content" zmp="zi-chevron-right" />
                <Text className="mb-0">Hôm nay 15h30 - 08/05 (sớm nhất)</Text>
              </ListItem>
              <ListItem className="editable-info">
                <Box slot="root-start" style={{ textAlign: 'left', marginLeft: 16, marginBottom: -16, marginTop: 0, paddingTop: 16 }}>Số điện thoại</Box>
                <Avatar slot="media" src={phone} size="24" />
                <div className="inline-input"><Input type="text" placeholder="Nhập số điện thoại..." /></div>
              </ListItem>
              <ListItem className="editable-info">
                <Box slot="root-start" style={{ textAlign: 'left', marginLeft: 16, marginBottom: -16, marginTop: 0, paddingTop: 16 }}>Ghi chú</Box>
                <img slot="media" src={note} size="24" />
                <div className="inline-input"><Input type="textarea" placeholder="Nhập nội dung ghi chú..." resizable /></div>
              </ListItem>
            </List>
          </ActionsLabel>
          <ActionsLabel className="p-0">
            <Box style={{ textAlign: 'left' }}><Text bold>Thông tin đơn hàng</Text></Box>
            <List className="my-0">
              {cart.map((item, i) => <ListItem key={i}>
                <ProductImage slot="media" image={item.product.image} style={{ width: 48 }} />
                <Price slot="content" amount={item.subtotal} unit="đ" className="pr-4" />
                <Box style={{ textAlign: 'left' }}>
                  <Text className="mb-0" bold>
                    <span style={{ color: '#B22830' }}>{item.quantity}x</span> {item.product.name}
                  </Text>
                  {item.size && <Text className="mb-0 text-secondary">
                    Size {item.size.name}
                  </Text>}
                  <ProductOrder product={item.product} cartItem={item} cartIndex={i}>
                    <Link className="text-primary">Chỉnh sửa</Link>
                  </ProductOrder>
                </Box>
              </ListItem>)}
              <ListItem>
                <Text slot="media" className="text-secondary">Tạm tính</Text>
                <Price slot="content" amount={totalAmount} unit="đ" className="pr-4" />
              </ListItem>
            </List>
          </ActionsLabel>
        </ActionsGroup>
        <ActionsGroup />
        <ActionsLabel className="p-0" style={{ position: 'sticky', bottom: 0, borderTop: `0.5px solid var(--zmp-color-nd200)` }}>
          <List className="my-0">
            <ListItem>
              <Text slot="before-title" className="text-secondary mb-0">Mã ưu đãi</Text>
              <Icon slot="content" zmp="zi-chevron-right" />
              <Link onClick={showDiscounts} slot="after" >{selectedDiscount ? <Text slot="after" bold className="mb-0">{selectedDiscount}</Text> : <Text className="text-secondary mb-0">Chọn mã ưu đãi</Text>}</Link>
            </ListItem>
            <ListItem>
              <div>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    defaultChecked
                  />
                  <Text style={{ textAlign: 'left', paddingLeft: 8 }} fontSize={12}>
                    Tôi đồng ý nhận món từ <b>15h30 - 15h45</b>. Sau thời gian này, tôi chấp nhận hủy món và không được hoàn tiền.
                    <a className="text-primary">Chọn giờ khác.</a>
                  </Text>
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Text>Tổng tiền</Text>
                  <Price style={{ marginLeft: 'auto' }} fontSize={20} bold amount={totalAmount} />
                </Box>
                <Box>
                  <Button large responsive fill>Thanh toán bằng ZaloPay</Button>
                </Box>
              </div>
            </ListItem>
          </List>
        </ActionsLabel>
      </Actions>
    </>
  )
};

Checkout.displayName = 'zmp-checkout'

export default Checkout;