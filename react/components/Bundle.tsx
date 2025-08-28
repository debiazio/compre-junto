import React, { useEffect, useState } from "react"
import { useProduct } from "vtex.product-context"
import { useQuery } from "react-apollo"
import { Checkbox } from "vtex.styleguide"
import { Wrapper } from "vtex.add-to-cart-button"
import { useCssHandles } from "vtex.css-handles"

import ACCESSORIES from "../graphql/getAccessories.graphql"

const CSS_HANDLES = ["ButtonBundle"] as const

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
  const productId = productContextValue?.product?.productId

  const [items, setItems] = useState<itemsArray[]>([])
  const { loading, data } = useQuery(ACCESSORIES, {
    variables: {
      productId: "199", // continua fixo para buscar acessórios do 199
    },
    skip: productId !== "199", // só faz a query se o produto atual for 199
  })

  const { handles } = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    if (loading) return
    setItems([]) // iniciamos sem o produto principal
  }, [loading, data])

  function isChecked(itemId: string) {
    return items.some((it) => it.id === itemId)
  }

  function toggleItem(itemId: string) {
    if (isChecked(itemId)) {
      setItems((prev) => prev.filter((it) => it.id !== itemId))
    } else {
      setItems((prev) => [...prev, { id: itemId, quantity: 1, seller: "1" }])
    }
  }

  // Se não for o produto 199, não renderiza nada
  if (productId !== "199") {
    return null
  }

  return (
    <>
      {!loading && data?.productRecommendations?.length > 0
        ? data.productRecommendations.map(
            (item: Accessories, index: number) => {
              const accessory = item.items[0]
              return (
                <div
                  key={index}
                  className={`${handles.ButtonBundle}`}
                  style={{ marginBottom: "1rem" }}
                >
                  <img
                    src={accessory?.images[0]?.imageUrl}
                    alt={item.productName}
                    style={{ maxWidth: "100px", marginBottom: "0.5rem" }}
                  />
                  <div>{item.productName}</div>
                  <p>
                    R$ {accessory?.sellers[0]?.commertialOffer?.Price?.toFixed(2)}
                  </p>
                  <Checkbox
                    checked={isChecked(accessory.itemId)}
                    id={`acc-${accessory.itemId}`}
                    label="Adicionar acessório"
                    name={`acc-${accessory.itemId}`}
                    onChange={() => toggleItem(accessory.itemId)}
                  />
                </div>
              )
            }
          )
        : null}

      <Wrapper skuItems={items} />
    </>
  )
}


export default Bundle
