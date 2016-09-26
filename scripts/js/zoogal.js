var paths;

paths = ['jquery'];

require.config({
  paths: {
    'jquery': 'vendor/jquery.min'
  }
});

require(paths, function() {
  return console.log($(document));
});
