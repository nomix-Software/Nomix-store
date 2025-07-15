'use client'
import Image from 'next/image';
import React, { useState } from 'react'

interface Props {
    images: {
        id: number;
        url: string;
        publicId: string;
    }[]
}
export const ImagesDetails = ({ images }: Props) => {
    const [index, setIndex] = useState(0)
    return (
        <div>
            <div className="image-container">
                {images.length && (
                    <Image
                        src={images[index].url}
                        alt="product image"
                        width={700}
                        height={500}
                        className="product-detail-image sm:min-w-[400px] sm:min-h-auto sm:!max-w-[500px]"
                        priority
                    />
                )}
            </div>
            <div className="small-images-container">
                {images.length > 1 &&
                    images.map((imagen, i) => (
                        <Image
                            key={`${imagen.id}-${i}`}
                            width={100}
                            height={100}
                            src={imagen.url}
                            alt="product image"
                            className={
                                i === index
                                    ? " cursor-pointer small-image selected-image hover:opacity-50 hover:scale-110"
                                    : "cursor-pointer small-image"
                            }
                            onMouseEnter={() => {
                                setIndex(i);
                            }}
                        />
                    ))}
            </div>
        </div>
    )
}
