'use client'
import React, { useState } from 'react'
import { Quantity } from '../ui/Quantity'
import { useCartStore } from '@/store'
import { formatPrice } from '@/utils/formatPrice'

interface Props {
    precio: number
    stock: number
    id: number
    nombre: string
    slug: string
    imagenURI: string

}
export const AddToCart = ({ stock, id, nombre, slug, precio, imagenURI }: Props) => {
    const [priceByQuantity, setPriceByQuantity] = useState(precio)
    const [quantity, setQuantity] = useState(1)
    const { addToCart, setShowCart, items } = useCartStore((state) => state);

    const handleChageQty = (value: number) => {
        if (value > stock || value < 0) return;
        setQuantity(value);
        setPriceByQuantity(value * precio)
    };

    const handleBuyNow = () => {
        // onAdd(product, qty);
        if (!stock) return;
        if(!Boolean(items.find( item => item.id === id))){            
            addToCart({
                id: id,
                nombre: nombre,
                slug: slug,
                cantidad: quantity,
                precio: precio,
                stock: stock,
                imagen: imagenURI,
            });
        }
        setShowCart(true);
    };

    return (
        <>
            <p className="price">{formatPrice(priceByQuantity)}</p>
            <Quantity
                quantity={quantity}
                onChange={(value) => handleChageQty(value)}
            />
            <div className="buttons">
                <button
                    type="button"
                    className="add-to-cart"
                    disabled={stock === 0 || quantity === 0}
                    onClick={() =>
                        addToCart({
                            id: id,
                            nombre: nombre,
                            slug: slug,
                            cantidad: quantity,
                            precio: precio,
                            stock: stock,
                            imagen: imagenURI,
                        })
                    }
                >
                    Agregar al carrito
                </button>
                <button type="button" className="buy-now" onClick={handleBuyNow}>
                    Comprar ahora
                </button>
            </div>
        </>
    )
}
