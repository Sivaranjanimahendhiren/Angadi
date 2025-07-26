/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
      id
      name
      description
      price
      image
      discount
      category
      stock
      reviews {
        nextToken
        __typename
      }
      cartItems {
        nextToken
        __typename
      }
      wishlistItems {
        nextToken
        __typename
      }
      bids {
        nextToken
        __typename
      }
      orderItems {
        nextToken
        __typename
      }
      posts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
      id
      name
      description
      price
      image
      discount
      category
      stock
      reviews {
        nextToken
        __typename
      }
      cartItems {
        nextToken
        __typename
      }
      wishlistItems {
        nextToken
        __typename
      }
      bids {
        nextToken
        __typename
      }
      orderItems {
        nextToken
        __typename
      }
      posts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
      id
      name
      description
      price
      image
      discount
      category
      stock
      reviews {
        nextToken
        __typename
      }
      cartItems {
        nextToken
        __typename
      }
      wishlistItems {
        nextToken
        __typename
      }
      bids {
        nextToken
        __typename
      }
      orderItems {
        nextToken
        __typename
      }
      posts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview($filter: ModelSubscriptionReviewFilterInput) {
    onCreateReview(filter: $filter) {
      id
      productID
      rating
      comment
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview($filter: ModelSubscriptionReviewFilterInput) {
    onUpdateReview(filter: $filter) {
      id
      productID
      rating
      comment
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview($filter: ModelSubscriptionReviewFilterInput) {
    onDeleteReview(filter: $filter) {
      id
      productID
      rating
      comment
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateCartItem = /* GraphQL */ `
  subscription OnCreateCartItem($filter: ModelSubscriptionCartItemFilterInput) {
    onCreateCartItem(filter: $filter) {
      id
      userId
      productId
      quantity
      addedAt
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateCartItem = /* GraphQL */ `
  subscription OnUpdateCartItem($filter: ModelSubscriptionCartItemFilterInput) {
    onUpdateCartItem(filter: $filter) {
      id
      userId
      productId
      quantity
      addedAt
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteCartItem = /* GraphQL */ `
  subscription OnDeleteCartItem($filter: ModelSubscriptionCartItemFilterInput) {
    onDeleteCartItem(filter: $filter) {
      id
      userId
      productId
      quantity
      addedAt
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateWishlistItem = /* GraphQL */ `
  subscription OnCreateWishlistItem(
    $filter: ModelSubscriptionWishlistItemFilterInput
  ) {
    onCreateWishlistItem(filter: $filter) {
      id
      userId
      productId
      addedAt
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateWishlistItem = /* GraphQL */ `
  subscription OnUpdateWishlistItem(
    $filter: ModelSubscriptionWishlistItemFilterInput
  ) {
    onUpdateWishlistItem(filter: $filter) {
      id
      userId
      productId
      addedAt
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteWishlistItem = /* GraphQL */ `
  subscription OnDeleteWishlistItem(
    $filter: ModelSubscriptionWishlistItemFilterInput
  ) {
    onDeleteWishlistItem(filter: $filter) {
      id
      userId
      productId
      addedAt
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
      id
      userId
      totalPrice
      status
      items {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
      id
      userId
      totalPrice
      status
      items {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder($filter: ModelSubscriptionOrderFilterInput) {
    onDeleteOrder(filter: $filter) {
      id
      userId
      totalPrice
      status
      items {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateOrderItem = /* GraphQL */ `
  subscription OnCreateOrderItem(
    $filter: ModelSubscriptionOrderItemFilterInput
  ) {
    onCreateOrderItem(filter: $filter) {
      id
      orderId
      productId
      name
      image
      price
      quantity
      order {
        id
        userId
        totalPrice
        status
        createdAt
        updatedAt
        __typename
      }
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateOrderItem = /* GraphQL */ `
  subscription OnUpdateOrderItem(
    $filter: ModelSubscriptionOrderItemFilterInput
  ) {
    onUpdateOrderItem(filter: $filter) {
      id
      orderId
      productId
      name
      image
      price
      quantity
      order {
        id
        userId
        totalPrice
        status
        createdAt
        updatedAt
        __typename
      }
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteOrderItem = /* GraphQL */ `
  subscription OnDeleteOrderItem(
    $filter: ModelSubscriptionOrderItemFilterInput
  ) {
    onDeleteOrderItem(filter: $filter) {
      id
      orderId
      productId
      name
      image
      price
      quantity
      order {
        id
        userId
        totalPrice
        status
        createdAt
        updatedAt
        __typename
      }
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateBid = /* GraphQL */ `
  subscription OnCreateBid($filter: ModelSubscriptionBidFilterInput) {
    onCreateBid(filter: $filter) {
      id
      productId
      userId
      amount
      status
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateBid = /* GraphQL */ `
  subscription OnUpdateBid($filter: ModelSubscriptionBidFilterInput) {
    onUpdateBid(filter: $filter) {
      id
      productId
      userId
      amount
      status
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteBid = /* GraphQL */ `
  subscription OnDeleteBid($filter: ModelSubscriptionBidFilterInput) {
    onDeleteBid(filter: $filter) {
      id
      productId
      userId
      amount
      status
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateBlog = /* GraphQL */ `
  subscription OnCreateBlog($filter: ModelSubscriptionBlogFilterInput) {
    onCreateBlog(filter: $filter) {
      id
      userId
      title
      posts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateBlog = /* GraphQL */ `
  subscription OnUpdateBlog($filter: ModelSubscriptionBlogFilterInput) {
    onUpdateBlog(filter: $filter) {
      id
      userId
      title
      posts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteBlog = /* GraphQL */ `
  subscription OnDeleteBlog($filter: ModelSubscriptionBlogFilterInput) {
    onDeleteBlog(filter: $filter) {
      id
      userId
      title
      posts {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($filter: ModelSubscriptionPostFilterInput) {
    onCreatePost(filter: $filter) {
      id
      blogID
      productId
      title
      content
      image
      blog {
        id
        userId
        title
        createdAt
        updatedAt
        __typename
      }
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      comments {
        nextToken
        __typename
      }
      likes {
        nextToken
        __typename
      }
      shares {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($filter: ModelSubscriptionPostFilterInput) {
    onUpdatePost(filter: $filter) {
      id
      blogID
      productId
      title
      content
      image
      blog {
        id
        userId
        title
        createdAt
        updatedAt
        __typename
      }
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      comments {
        nextToken
        __typename
      }
      likes {
        nextToken
        __typename
      }
      shares {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($filter: ModelSubscriptionPostFilterInput) {
    onDeletePost(filter: $filter) {
      id
      blogID
      productId
      title
      content
      image
      blog {
        id
        userId
        title
        createdAt
        updatedAt
        __typename
      }
      product {
        id
        name
        description
        price
        image
        discount
        category
        stock
        createdAt
        updatedAt
        __typename
      }
      comments {
        nextToken
        __typename
      }
      likes {
        nextToken
        __typename
      }
      shares {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($filter: ModelSubscriptionCommentFilterInput) {
    onCreateComment(filter: $filter) {
      id
      postID
      userId
      content
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($filter: ModelSubscriptionCommentFilterInput) {
    onUpdateComment(filter: $filter) {
      id
      postID
      userId
      content
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($filter: ModelSubscriptionCommentFilterInput) {
    onDeleteComment(filter: $filter) {
      id
      postID
      userId
      content
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateLike = /* GraphQL */ `
  subscription OnCreateLike($filter: ModelSubscriptionLikeFilterInput) {
    onCreateLike(filter: $filter) {
      id
      postID
      userId
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateLike = /* GraphQL */ `
  subscription OnUpdateLike($filter: ModelSubscriptionLikeFilterInput) {
    onUpdateLike(filter: $filter) {
      id
      postID
      userId
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteLike = /* GraphQL */ `
  subscription OnDeleteLike($filter: ModelSubscriptionLikeFilterInput) {
    onDeleteLike(filter: $filter) {
      id
      postID
      userId
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateShare = /* GraphQL */ `
  subscription OnCreateShare($filter: ModelSubscriptionShareFilterInput) {
    onCreateShare(filter: $filter) {
      id
      postID
      userId
      platform
      sharedAt
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateShare = /* GraphQL */ `
  subscription OnUpdateShare($filter: ModelSubscriptionShareFilterInput) {
    onUpdateShare(filter: $filter) {
      id
      postID
      userId
      platform
      sharedAt
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteShare = /* GraphQL */ `
  subscription OnDeleteShare($filter: ModelSubscriptionShareFilterInput) {
    onDeleteShare(filter: $filter) {
      id
      postID
      userId
      platform
      sharedAt
      post {
        id
        blogID
        productId
        title
        content
        image
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
