/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    "name" : {
      type: "object"
    },
    "email" : {
      type: "string"
    },
    "username" : {
      type: "string",
      unique: true
    },
    "password" : {
      type: "string"
    },
    "role" :{
      type: "object"
    },
    "twitter" : {
      type: "object"
    }
  }
};

