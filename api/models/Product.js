/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    header: {
      type: 'string'
    },
    brand: {
      type: 'string'
    },
    model: {
      type: 'string'
    },
    inStock: {
      type: 'boolean',
      defaultsTo: true
    },
    shortDescription: {
      type: 'mediumtext'
    },
    originalPrice: {
      type: 'integer',
      defaultsTo: 0
    },
    discountPrice: {
      type: 'integer',
      defaultsTo: 0
    },
    longDescription: {
      type: 'longtext'
    },
    details: {
      type: 'string'
    },
    category: {
      type: 'string'
    },
    subCategory: {
      type: 'string'
    },
    hot: {
      type: 'boolean',
      defaultsTo: false
    },
    new: {
      type: 'boolean',
      defaultsTo: false
    },
    sale: {
      type: 'boolean',
      defaultsTo: false
    },
    pics: {
      collection: 'pictures',
      via: 'item'
    }
  }
};

