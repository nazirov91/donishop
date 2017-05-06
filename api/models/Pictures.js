/**
 * Pictures.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    location: {
      type: 'string'
    },
    main: {
      type: 'boolean',
      defaultsTo: false,
      required: false
    },
    item: {
      model: 'product'
    }
  }
};

