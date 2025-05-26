import React, { useEffect, useState }  from "react"
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'
import { Button } from 'vtex.styleguide'
import { Wrapper } from 'vtex.add-to-cart-button'
import { useCssHandles } from 'vtex.css-handles'

import ACCESSORIES from '../graphql/getAccessories.graphql'

const CSS_HANDLES = [
  'ButtonBundle'
] as const

interface Accessories {
  productName: string
  items: {
    itemId: string
    images: {
      imageUrl: string
    }[]
    sellers: {
      commertialOffer: {
        Price: number
      }
    }[]
  }[]
}



interface itemsArray {
  id: string | undefined
  quantity: number | undefined
  seller: string
}

function Bundle() {
  const productContextValue = useProduct()
  const [ items, setitems ] = useState<itemsArray[]>()
  const {loading, data} = useQuery(ACCESSORIES, {
    variables: {
      productId: "199"
    }
  })

  const { handles } = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    if(loading) return

    console.log('productContextValue', productContextValue)
    console.log('data', data)

    const initialItem: itemsArray[] = [
      {
        id: productContextValue?.selectedItem?.itemId,
        quantity: productContextValue?.selectedQuantity,
        seller: "1"
      }

    ]


    setitems(initialItem)

  },[loading, data])

  useEffect(() => {

    console.log('items', items)
  }, [items])

  function addItem (itemId: string) {
    const newItem = [
      {
        id: itemId,
        quantity: 1,
        seller: "1"
      }
    ]

    setitems(items?.concat(newItem))
  }

  return (
    <>
      {/* <p>Complemente o produto:</p>
      <h3>{productContextValue?.selectedItem?.nameComplete}</h3>
      <p>COMPRANDO JUNTO:</p> */}
{
  !loading && data?.productRecommendations.length > 0
    ? data.productRecommendations.map((item: Accessories, index: number) => (
        <div key={index} className={`${handles.ButtonBundle}`} style={{ marginBottom: '1rem' }}>
          <img
            src={item.items[0]?.images[0]?.imageUrl}
            alt={item.productName}
            style={{ maxWidth: '100px', marginBottom: '0.5rem' }}
          />
          <div>{item.productName}</div>
          <p>R$ {item.items[0]?.sellers[0]?.commertialOffer?.Price?.toFixed(2)}</p>
          <Button
            variation="secondary"
            onClick={() => addItem(item.items[0].itemId)}
          >
            Adicionar
          </Button>
        </div>
      ))
    : null
}


      <Wrapper
        skuItems={items}/>
    </>
  )
}

export default Bundle
