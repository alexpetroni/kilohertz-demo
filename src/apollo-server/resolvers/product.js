const resolvers = {
  Query: {
    product (_, { id, raw = false }, context) {
      return context.models.Product.product(id, raw)
    },

    // productBy (_, { field, value, args }, context) {
    //   return context.models.Product.productBy(field, value, args)
    // },
    //
    // productBySku (_, { sku, args }, context) {
    //   return context.models.Product.productBySku(sku, args)
    // },
    //
    // productBySlug (_, { slug, args }, context) {
    //   return context.models.Product.productBySlug(slug, args)
    // },
    //
    // products (_, { idArr, args }, context) {
    //   return context.models.Product.products(idArr, args)
    // },
    //
    // productsBy (_, { field, valueArr, args }, context) {
    //   return context.models.Product.productsBy(field, valueArr, args)
    // },
    //
    // productsBySku (_, { skuArr, args }, context) {
    //   return context.models.Product.productsBySku(skuArr, args)
    // },
    //
    // productsBySlug (_, { slugArr, args }, context) {
    //   return context.models.Product.productsBySlug(slugArr, args)
    // },
    //
    searchProducts (_, { args }, context) {
      return context.models.Product.searchProducts(args)
    },

    paginatedProducts (_, { args }, context) {
      return context.models.Product.paginatedProducts(args)
    },


    // productTags (_, { field, value }, context) {
    //   return context.models.Product.productTags(field, value)
    // },
    //
    productCategories (_, { field, value }, context) {
      return context.models.Product.productCategories(field, value)
    },
    //
    // productBrand (_, { field, value }, context) {
    //   return context.models.Product.productBrand(field, value)
    // },
    //
    // productImage (_, { id }, context) {
    //   return context.models.Product.productImage(id)
    // },
    //
    // productGallery (_, { field, value }, context) {
    //   return context.models.Product.productGallery(field, value)
    // },
    //
    // productFamily (_, { field, value }, context) {
    //   return context.models.Product.productFamily(field, value)
    // },

    // productDelivery (_, { id }, context) {
    //   return context.models.Product.productDelivery(id)
    // },

    // productPriceRaw (_, { id }, context) {
    //   return context.models.Product.productPriceRaw(id)
    // },

    // productVariation (_, { parentId, id }, context) {
    //   return context.models.Product.productVariation(parentId, id)
    // },
    //
    // productVariableFeatures (_, { id }, context) {
    //   return context.models.Product.productVariableFeatures(id)
    // },

    // productVariableFeaturesLean (_, { id }, context) {
    //   return context.models.Product.productVariableFeaturesLean(id)
    // },

    // productVariationsItems (_, { id, options }, context) {
    //   return context.models.Product.productVariationsItems(id)
    // },

    // productVariationsItemAdmin (_, { sku, options }, context) {
    //   return context.models.Product.productVariationsItemAdmin(sku)
    // },
    // cartProducts (_, { idArr, args }, context) {
    //   return context.models.Product.cartProducts(idArr, args)
    // },
    //
    // productsExport (_, {}, context) {
    //   return context.models.Product.productsExport()
    // }
  },

  Mutation: {
    createProduct(_, { input }, context){
      return context.models.Product.createProduct(input)
    },

    updateProduct(_, { id, input }, context){
      return context.models.Product.updateProduct(id, input)
    },

    deleteProduct(_, { id }, context){
      return context.models.Product.deleteProduct(id)
    },

    deleteProducts(_, { idArr }, context){
      return context.models.Product.deleteProducts(idArr)
    },

    updateProductTags(_, { id, idArr }, context){
      return context.models.Product.updateProductTags(id, idArr)
    },

    updateProductCategories(_, { id, idArr }, context){
      return context.models.Product.updateProductCategories(id, idArr)
    },

    updateProductBrand(_, { id, brandId }, context){
      return context.models.Product.updateProductBrand(id, brandId)
    },

    updateProductImage(_, { id, imageId }, context){
      return context.models.Product.updateProductImage(id, imageId)
    },

    updateProductGallery(_, { id, idArr }, context){
      return context.models.Product.updateProductGallery(id, idArr)
    },

    updateProductVariableFeatures(_, { id, inputArr }, context){
      return context.models.Product.updateProductVariableFeatures(id, inputArr)
    },

    //
    // updateProductVariableFeatures(_, { id, itemsArr }, context){
    //   return context.models.Product.updateProductVariableFeatures(id, itemsArr)
    // },
    //
    addProductVariation(_, { parentId, input }, context){
      return context.models.Product.addProductVariation(parentId, input)
    },

    updateProductVariation(_, {parentId, id, input }, context){
      return context.models.Product.updateProductVariation(parentId, id, input)
    },

    updateProductVariations(_, { parentId, inputArr }, context){
      return context.models.Product.updateProductVariations(parentId, inputArr)
    },

    deleteProductVariation(_, { parentId, id }, context){
      return context.models.Product.deleteProductVariation(parentId, id)
    },

    deleteProductVariations(_, { parentId, idArr }, context){
      return context.models.Product.deleteProductVariations(id, idArr)
    },

  },

  Product: {
    __resolveType(obj, context, info){
      if(obj.type == "SIMPLE"){
        return 'SimpleProduct'
      }

      if(obj.type == "VARIABLE"){
        return 'VariableProduct'
      }

      if(obj.type == "VARIATION"){
        return 'ProductVariation'
      }

      return null
    }
  },
}



module.exports = resolvers
