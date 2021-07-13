import React, { useEffect, useState } from 'react';
import { Tabbar, Link, Box, Text, Button, useStore, zmp } from 'zmp-framework/react';
import { Price } from './prices'
import cup from '../../assets-src/cup.svg'
import discount from '../../assets-src/discount.svg'
import history from '../../assets-src/history.svg'
import Checkout from './checkout'

const BottomNavigation = () => {
    const totalQuantity = useStore('totalQuantity')
    const totalAmount = useStore('totalAmount')
    const [currentPath, setCurrentPath] = useState()

    zmp.views.main.router.on('routeChange', ({ path }) => {
        setCurrentPath(path)
    })

    const links = [
        { name: 'Đặt món', href: "/", icon: cup },
        { name: 'Ưu đãi', href: "/discount", icon: discount },
        { name: 'Lịch sử', href: "/history", icon: history },
    ]

    return <div className="bottom-navigation">
        {totalQuantity > 0 && <div className="cart">
            <Box>
                <Price fontSize={20} bold amount={totalAmount} className="mb-0" />
                <Text className="text-secondary">Bạn có {totalQuantity} món trong giỏ hàng.</Text>
            </Box>
            <Box style={{ textAlign: 'right' }}>
                <Checkout>
                    <Button fill large>Giỏ hàng</Button>
                </Checkout>
            </Box>
        </div>}
        <Tabbar bottom>
            {links.map(({ name, icon, href }) => <Link key={href} className={href === currentPath ? 'active' : 'inactive'} href={href}>
                <img src={icon} />
                {name}
            </Link>)}
        </Tabbar>
    </div>;
}

BottomNavigation.displayName = 'zmp-bottom-navigation'

export default BottomNavigation;