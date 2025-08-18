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
  const [items, setItems] = useState<itemsArray[]>([])
  const { loading, data } = useQuery(ACCESSORIES, {
    variables: {
      productId: "199", // id do produto base
    },
  })

  const { handles } = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    if (loading) return
    console.log("productContextValue", productContextValue)
    console.log("data", data)

    // iniciamos sem o produto principal
    setItems([])
  }, [loading, data])

  // Verifica se um acessório já está na lista
  function isChecked(itemId: string) {
    return items.some((it) => it.id === itemId)
  }

  // Marca/desmarca acessório
  function toggleItem(itemId: string) {
    if (isChecked(itemId)) {
      // remove se já estiver
      setItems((prev) => prev.filter((it) => it.id !== itemId))
    } else {
      // adiciona se não estiver
      const newItem = {
        id: itemId,
        quantity: 1,
        seller: "1",
      }
      setItems((prev) => [...prev, newItem])
    }
  }

  return (
    <>
      {!loading && data?.productRecommendations.length > 0
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
