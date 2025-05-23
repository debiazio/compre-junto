import React, { useEffect }  from "react"
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'
import { Button } from 'vtex.styleguide'

import ACCESSORIES from '../graphql/getAcessories.graphql'

interface Accessories {
  productName: string
}

function Bundle() {
  const productContextValue = useProduct()
  const {loading, data} = useQuery(ACCESSORIES, {
    variables: {
      productId: "199"
    }
  })

  useEffect(() => {
    if(loading) return

    console.log('productContextValue', productContextValue)
    console.log('data', data)

  },[loading, data])



  return (
    <>
      <p>Complemente o produto:</p>
      <h3>{productContextValue?.selectedItem?.nameComplete}</h3>
      <p>com:</p>
      {
        !loading && data?.productRecommendations.length > 0
          ? data?.productRecommendations.map(
            (item: Accessories) => (
              <Button variation="secondary">{item.productName}</Button>
            ))
          : ""

      }
    </>
  )
}

export default Bundle
