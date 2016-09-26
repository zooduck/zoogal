paths = [
	'jquery'
]
require.config
	paths:
		'jquery': 'vendor/jquery.min'

require paths, () ->
	# All JavaScript here...
	console.log $(document) # test Jquery loaded	
