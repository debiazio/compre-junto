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
  items: itemId[]
}

interface itemId{
  itemId: string
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
      <p>Complemente o produto:</p>
      <h3>{productContextValue?.selectedItem?.nameComplete}</h3>
      <p>com:</p>
      {
        !loading && data?.productRecommendations.length > 0
          ? data?.productRecommendations.map(
            (item: Accessories) => (
              <div className={`${handles.ButtonBundle}`}>
              <Button
                  variation="secondary"
                  onClick={() => addItem(item.items[0].itemId)}
                >{item.productName}</Button>
                </div>
            ))
          : ""

      }
      <Wrapper
        skuItems={items}/>
    </>
  )
}

export default Bundle
