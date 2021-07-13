import React, { useState, useMemo, useEffect } from 'react';
import { Card, Text, Title, Actions, ActionsGroup, ActionsLabel, Button, Icon, Input, Row, Col, Box, List, ListItem, useStore, zmp } from 'zmp-framework/react';
import { Price, ExtraPrice } from './prices'
import ProductImage from './product-image'
import store from '../store';

const ProductOrder = ({ product, children, cartItem, cartIndex }) => {
    const { id, name, price, image, sizes, toppings } = product
    const [showOrder, setShowOrder] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [size, setSize] = useState(sizes[0])
    const [topping, setTopping] = useState()
    const [note, setNote] = useState('')

    useEffect(() => {
        if (cartItem) {
            setQuantity(cartItem.quantity)
            setSize(cartItem.size)
            setTopping(cartItem.topping)
            setNote(cartItem.note)
        }
    }, [showOrder])

    const increaseQuantity = () => {
        setQuantity(quantity + 1)
    }
    const decreaseQuantity = () => {
        const limit = cartItem ? 0 : 1
        setQuantity(quantity > limit ? quantity - 1 : limit)
    }

    const subtotal = useMemo(() => {
        let subtotal = price
        if (size) {
            subtotal += size.extra
        }
        if (topping) {
            subtotal += topping.extra
        }
        subtotal *= quantity
        return subtotal;
    }, [quantity, size, topping])

    const order = () => {
        const item = {
            quantity,
            size,
            topping,
            subtotal,
            note,
            product
        }
        if (cartItem) {
            store.dispatch('updateCartItem', { index: cartIndex, item })
        } else {
            store.dispatch('addToCart', item)
        }
    }
    const addToCart = () => {
        order()
        setShowOrder(false)
    }

    const removeFromCart = () => {
        zmp.dialog.create({
            title: "Xác nhận",
            content:
                'Bạn có chắc muốn xoá sản phẩm này khỏi đơn hàng?',
            buttons: [
                {
                    text: "Không",
                    close: true,
                },
                {
                    text: "Đồng Ý",
                    close: true,
                    onClick() {
                        setShowOrder(false)
                        store.dispatch('removeCartItem', cartIndex)
                    }
                },
            ],
        }).open();
    }

    const checkout = () => {
        order()
        setShowOrder(false)
        store.dispatch('setShowCheckout', true)
    }

    return <div>
        <div onClick={() => setShowOrder(true)}>
            {children}
        </div>
        <Actions
            opened={showOrder}
            onActionsClosed={() => setShowOrder(false)}
        >
            <ActionsGroup className="address-picker-actions">
                <Button typeName="ghost" className="close-button" onClick={() => setShowOrder(false)}>
                    <Icon zmp="zi-close" size={24}></Icon>
                </Button>
                <ActionsLabel bold>
                    <span className="title">Chọn thức uống</span>
                </ActionsLabel>
                <ActionsLabel style={{ backgroundColor: 'white' }}>
                    <Row>
                        <Col style={{ flex: 1, paddingRight: 16 }}><ProductImage image={image} style={{ width: '100%' }} /></Col>
                        <Col style={{ flex: '1 1 auto', textAlign: 'left', alignSelf: 'center' }}>
                            <Title style={{ color: 'black' }} bold>{name}</Title>
                            <Price amount={price} />
                        </Col>
                    </Row>
                </ActionsLabel>
                <ActionsLabel className="p-0" style={{ textAlign: 'left' }}>
                    <Box><Text bold>Chọn Size</Text></Box>
                    <List className="my-0">
                        {sizes.map(s => <ListItem key={s.name} radio value={s.name} name="s" title={s.name} checked={size === s} onClick={() => setSize(s)}>
                            {s.extra && <ExtraPrice amount={s.extra} />}
                        </ListItem>)}
                    </List>
                </ActionsLabel>
                <ActionsLabel className="p-0" style={{ textAlign: 'left' }}>
                    <Box><Text bold>Chọn Topping</Text></Box>
                    <List className="my-0">
                        {toppings.map(t => <ListItem key={t.name} radio value={t.name} name="t" title={t.name} checked={topping === t} onClick={() => setTopping(t)}>
                            {t.extra && <ExtraPrice amount={t.extra} />}
                        </ListItem>)}
                    </List>
                </ActionsLabel>
                <ActionsLabel className="p-0" style={{ textAlign: 'left' }}>
                    <Box><Text bold>Số lượng</Text></Box>
                    <List className="my-0">
                        <ListItem>
                            <div style={{ display: 'flex', margin: 'auto', color: 'black' }}>
                                <Button small typeName="tertiary" onClick={decreaseQuantity}>-</Button>
                                <Box mx={6} mt={1}>{quantity}</Box>
                                <Button small typeName="tertiary" onClick={increaseQuantity}>+</Button>
                            </div>
                        </ListItem>
                    </List>
                </ActionsLabel>
                <ActionsLabel className="p-0" style={{ textAlign: 'left' }}>
                    <Box><Text bold>Ghi chú</Text></Box>
                    <List className="my-0">
                        <ListItem>
                            <div style={{ flex: 1, height: 48 }}>
                                <Input value={note} onChange={(e) => setNote(e.target.value)} type="text" placeholder="Nhập ghi chú (VD. Ít đá, nhiều đường...)" />
                            </div>
                        </ListItem>
                    </List>
                </ActionsLabel>
            </ActionsGroup>
            <ActionsGroup />
            <ActionsGroup style={{ position: 'sticky', bottom: 0, borderTop: `0.5px solid var(--zmp-color-nd200)` }}>
                <ActionsLabel className="p-2" style={{ textAlign: 'left' }}>
                    <Row>
                        <Col><Box>Tổng tiền</Box></Col>
                        <Col style={{ textAlign: 'right' }}>
                            <Box><Price className="text-primary" bold fontSize={20} amount={subtotal} /></Box>
                        </Col>
                    </Row>
                    <Row gap="gap_4" className="px-2 pb-2" style={{ margin: 0 }}>
                        {cartItem ?
                            <Col>
                                {quantity > 0 ?
                                    <Button responsive typeName="primary" onClick={checkout}>Cập nhật giỏ hàng</Button> :
                                    <Button responsive typeName="destructive" onClick={removeFromCart}>Xoá khỏi giỏ hàng</Button>}
                            </Col> :
                            <>
                                <Col>
                                    <Button responsive typeName="secondary" onClick={checkout}>Mua ngay</Button>
                                </Col>
                                <Col>
                                    <Button responsive typeName="primary" onClick={addToCart}>Thêm vào giỏ</Button>
                                </Col>
                            </>
                        }
                    </Row>
                </ActionsLabel>
            </ActionsGroup>
        </Actions>
    </div >
}

ProductOrder.displayName = 'zmp-product-order'

export default ProductOrder;