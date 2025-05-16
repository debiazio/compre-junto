import React from "react"
import { useProduct } from 'vtex.product-context'

function Bundle() {
  const productContextValue = useProduct()

  console.log('productContextValue', productContextValue)

  return (<div>Teste components</div>)
}

export default Bundle
