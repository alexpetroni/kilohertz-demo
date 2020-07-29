const typeDef = `

  extend type Query {
    product(id: ID!, raw:Boolean): Product
    productBy(field: String!, value: String!, args: JSON): Product
    productBySku(sku: String!, args: JSON): Product
    productBySlug(slug: String!, args: JSON): Product

    paginatedProducts(args: JSON): PaginatedProducts!
    searchProducts(args: JSON): [Product!]!

    productCategories(field: String!, value: String!): [Category!]!

    productFamily(field: String!, value: String!): Family

    productVariation(parentId: ID!, id: ID!): PVItem
  }

  extend type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): String
    deleteProducts(idArr: [ID!]!): [ID!]!

    updateProductTags(id: ID!, idArr: [ID!]!): [Tag!]!
    updateProductCategories(id: ID!, idArr: [ID!]!): [Category!]!
    updateProductBrand(id: ID!, brandId: ID): Brand

    updateProductImage(id: ID!, imageId: ID): ID
    updateProductGallery(id: ID!, idArr: [ID!]!): [ID!]!

    updateProductVariableFeatures(id: ID!, inputArr: [ProductVariableFeatureInput!]!): [ProductVariableFeature!]!

    addProductVariation(parentId: ID!, input: PVItemInput!): PVItem
    updateProductVariation(parentId: ID!, id: ID!, input: PVItemInput!): PVItem
    updateProductVariations(parentId: ID!, inputArr: [PVItemInput!]!): [PVItem!]!
    deleteProductVariation(parentId: ID!, id: ID!): ID
    deleteProductVariations(parentId: ID!, idArr: [ID!]!): [ID!]!
  }

  enum ProductType {
    SIMPLE
    VARIABLE
    VARIATION
  }

  enum SaleType {
    ACTION
    STOCK_LIQUIDATION
  }

  interface Product {
    id: ID!
    createdAt: Date
    updatedAt: Date

    type: ProductType
    name: String
    slug: String
    sku: String!

    published: Boolean

    displayOrder: Int

    excerpt: String
    description: String
    longDescription: String

    technicalInformation: String

    currency: String

    price: Float
    volumePrice: String

    salePrice: Float
    saleVolumePrice: String

    regularPrice: Float
    regularVolumePrice: String

    discount: Float
    vat: Float

    saleIsActive: Boolean
    saleType: SaleType

    inStock: Boolean
    stock: Int

    saleStartDate: Date
    saleEndDate: Date

    brand: Brand

    image: String

    sizeWidth: Float
    sizeHeight: Float
    sizeLength: Float
    sizeUnit: String

    weightNet: Float
    weightGross: Float
    weightUnit: String

    packageWidth: Float
    packageHeight: Float
    packageLength: Float
    packageSizeUnit: String

    packageWeight: Float
    packageWeightUnit: String

    packaging: String

    previewFields: [ProductPreviewFields]
  }

  input ProductInput {
    type: ProductType
    name: String
    slug: String
    sku: String

    published: Boolean

    displayOrder: Int

    excerpt: String
    description: String
    longDescription: String

    technicalInformation: String

    currency: String

    price: Float
    volumePrice: String

    salePrice: Float
    saleVolumePrice: String

    regularPrice: Float
    regularVolumePrice: String

    discount: Float
    vat: Float

    saleIsActive: Boolean
    saleType: SaleType

    inStock: Boolean
    stock: Int

    saleStartDate: Date
    saleEndDate: Date

    brand: String

    image: String

    sizeWidth: Float
    sizeHeight: Float
    sizeLength: Float
    sizeUnit: String

    weightNet: Float
    weightGross: Float
    weightUnit: String

    packageWidth: Float
    packageHeight: Float
    packageLength: Float
    packageSizeUnit: String

    packageWeight: Float
    packageWeightUnit: String

    packaging: String

    previewFields: [ProductPreviewFieldsInput]
  }

  type SimpleProduct implements Product {

    # --- Interface Product  ---
    id: ID!
    createdAt: Date
    updatedAt: Date

    type: ProductType
    name: String
    slug: String
    sku: String!

    published: Boolean

    displayOrder: Int

    excerpt: String
    description: String
    longDescription: String

    technicalInformation: String

    currency: String

    price: Float
    volumePrice: String

    salePrice: Float
    saleVolumePrice: String

    regularPrice: Float
    regularVolumePrice: String

    discount: Float
    vat: Float

    saleIsActive: Boolean
    saleType: SaleType

    inStock: Boolean
    stock: Int

    saleStartDate: Date
    saleEndDate: Date

    brand: Brand

    image: String

    sizeWidth: Float
    sizeHeight: Float
    sizeLength: Float
    sizeUnit: String

    weightNet: Float
    weightGross: Float
    weightUnit: String

    packageWidth: Float
    packageHeight: Float
    packageLength: Float
    packageSizeUnit: String

    packageWeight: Float
    packageWeightUnit: String

    packaging: String

    previewFields: [ProductPreviewFields]
  }


  type VariableProduct implements Product {

    minPrice: Float
    maxPrice: Float

    minRegularPrice: Float
    maxRegularPrice: Float
    maxDiscount: Float

    variableFeatures: [ProductVariableFeature!]!
    variations: [PVItem]!
    defaultSelectedVariation: String


    # --- Interface Product  ---
    id: ID!
    createdAt: Date
    updatedAt: Date

    type: ProductType
    name: String
    slug: String
    sku: String!

    published: Boolean

    displayOrder: Int

    excerpt: String
    description: String
    longDescription: String

    technicalInformation: String

    currency: String

    price: Float
    volumePrice: String

    salePrice: Float
    saleVolumePrice: String

    regularPrice: Float
    regularVolumePrice: String

    discount: Float
    vat: Float

    saleIsActive: Boolean
    saleType: SaleType

    inStock: Boolean
    stock: Int

    saleStartDate: Date
    saleEndDate: Date

    brand: Brand

    image: String

    sizeWidth: Float
    sizeHeight: Float
    sizeLength: Float
    sizeUnit: String

    weightNet: Float
    weightGross: Float
    weightUnit: String

    packageWidth: Float
    packageHeight: Float
    packageLength: Float
    packageSizeUnit: String

    packageWeight: Float
    packageWeightUnit: String

    packaging: String

    previewFields: [ProductPreviewFields]
  }

  # 'slug' is the parent slug
  # all the interface properties are the parent ones if not overwritten (except 'slug', 'brand', 'vat', 'currency' which cannot be overwritten)
  type ProductVariation implements Product {

    variableFeatures: [ProductVariableFeature!]! #it will be sent only with the feature for the variation
    featuresConfig: JSON # it is provided for consistency, ex. using existing methods in front-end
    parentSku: String

    # --- Interface Product  ---
    id: ID!
    createdAt: Date
    updatedAt: Date

    type: ProductType
    name: String
    slug: String
    sku: String!

    published: Boolean

    displayOrder: Int

    excerpt: String
    description: String
    longDescription: String

    technicalInformation: String

    currency: String

    price: Float
    volumePrice: String

    salePrice: Float
    saleVolumePrice: String

    regularPrice: Float
    regularVolumePrice: String

    discount: Float
    vat: Float

    saleIsActive: Boolean
    saleType: SaleType

    inStock: Boolean
    stock: Int

    saleStartDate: Date
    saleEndDate: Date

    brand: Brand

    image: String

    sizeWidth: Float
    sizeHeight: Float
    sizeLength: Float
    sizeUnit: String

    weightNet: Float
    weightGross: Float
    weightUnit: String

    packageWidth: Float
    packageHeight: Float
    packageLength: Float
    packageSizeUnit: String

    packageWeight: Float
    packageWeightUnit: String

    packaging: String

    previewFields: [ProductPreviewFields]
  }

  # it is a subset of Product interface, except 'type' (always 'VARIATION'), 'slug', 'vat', 'brand', 'currency' which are specific to parent product
  type PVItem {
    id: ID!
    createdAt: Date
    updatedAt: Date

    name: String
    sku: String

    published: Boolean

    excerpt: String
    description: String
    longDescription: String

    technicalInformation: String

    price: Float
    volumePrice: String

    salePrice: Float
    saleVolumePrice: String

    regularPrice: Float
    regularVolumePrice: String

    discount: Float

    saleIsActive: Boolean
    saleType: SaleType

    inStock: Boolean
    stock: Int

    saleStartDate: Date
    saleEndDate: Date

    image: String

    sizeWidth: Float
    sizeHeight: Float
    sizeLength: Float
    sizeUnit: String

    weightNet: Float
    weightGross: Float
    weightUnit: String

    packageWidth: Float
    packageHeight: Float
    packageLength: Float
    packageSizeUnit: String

    packageWeight: Float
    packageWeightUnit: String

    packaging: String

    #featuresConfig: [FeatureConfig!]!
    featuresConfig: JSON
  }

  input PVItemInput {
    id: ID

    type: ProductType
    name: String
    sku: String

    published: Boolean

    excerpt: String
    description: String
    longDescription: String

    technicalInformation: String

    price: Float
    volumePrice: String

    salePrice: Float
    saleVolumePrice: String

    regularPrice: Float
    regularVolumePrice: String

    discount: Float

    saleType: SaleType

    inStock: Boolean
    stock: Int

    saleStartDate: Date
    saleEndDate: Date

    image: String

    sizeWidth: Float
    sizeHeight: Float
    sizeLength: Float
    sizeUnit: String

    weightNet: Float
    weightGross: Float
    weightUnit: String

    packageWidth: Float
    packageHeight: Float
    packageLength: Float
    packageSizeUnit: String

    packageWeight: Float
    packageWeightUnit: String

    packaging: String

    #featuresConfig: [FeatureConfigInput!]
    featuresConfig: JSON
  }

  type FeatureConfig {
    vfSlug: String #VariableFeatureSlug
    fiSlug: String #VariableFeatureItemSlug
  }

  input FeatureConfigInput {
    vfSlug: String
    fiSlug: String
  }

  type ProductVariableFeature implements  VariableFeature {
    type: VariableFeatureType!
    name: String
    slug: String
    description: String
    longDescription: String
    items: [VariableFeatureItem!]!
  }

  input ProductVariableFeatureInput {
    slug: String! #VariableFeatureSlug
    items: [String!] #VariableFeatureItemSlug
  }

  type ProductAttachments {
    type: String
    attachments: [String!]!
  }

  type ProductPreviewFields {
    title: String
    content: String
    image: String
  }

  input ProductPreviewFieldsInput {
    title: String
    content: String
    image: String
  }

  type PaginatedProducts{
    total: Int
    items: [Product!]!
  }

`
module.exports = typeDef
