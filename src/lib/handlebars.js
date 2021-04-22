helpers = {}


helpers.is = function(a, b, opts) {
  if (a == b) {
      return opts.fn(this) 
  } else { 
      return opts.inverse(this) 
  } 
}

helpers.iss = function(a, b, opts) {
  if (a > b) {
      return opts.fn(this) 
  } else { 
      return opts.inverse(this) 
  } 
}

module.exports = helpers;