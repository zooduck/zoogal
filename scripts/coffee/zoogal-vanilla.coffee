class ZooGal
	data:
		count: 0
		previews_loaded: 0
		links: {}
		dom: []
		temp: []

	init: (data) ->

		types = ['hd', 'prev']
		for i, array of data
			type = types.shift()
			@.data.links[type] = []
			for link in array
				@.data.links[type].push link
		@.data.count = @.data.links.prev.length

		for link in @.data.links.prev
			_this = @
			obj = {}
			img = new Image()
			img.src = link
			img.alt = ''
			@.data.temp.push img
			img.addEventListener 'load', () ->
				_this.previewsLoaded(_this.data.count)				

	previewsLoaded: (count) ->

		@.data.previews_loaded++
		if @.data.previews_loaded == @.data.count
			for img, i in @.data.temp
				canvas_half = @.chopImage img, i
				img.draggable = false
				img.addEventListener 'dragstart', (e) ->
					e.preventDefault() if e.preventDefault
				obj = 
					img: img
					canvas_half: canvas_half
					width: img.width or img.naturalWidth
					height: img.height or img.naturalHeight
				@.data.dom.push obj
			
			@.buildMalenkyDOM()

	buildMalenkyDOM: () ->		

		zoo_slides_flex_jc_center = document.createElement 'DIV'
		zoo_slides_flex_jc_center.className += 'zoo-slides-flex-jc_center'
		zoo_slides_container_wrap = document.createElement 'DIV'
		zoo_slides_container_wrap.className += ' zoo-slides-container-wrap'
		zoo_slides_flex_jc_center.appendChild zoo_slides_container_wrap

		count = 0
		for prev in @.data.dom	

			zoo_slides_container = document.createElement 'DIV'
			zoo_slides_container.className += ' zoo-slides-container col-xs-6 col-sm-6 col-md-3'
			zoo_slide_wrapper = document.createElement 'DIV'
			zoo_slide_wrapper.className += ' zoo-slide-wrapper ready'
			half_cover = document.createElement 'DIV'
			half_cover.className += ' half-cover'
			zoo_slide_wrapper.appendChild prev.img
			zoo_slide_wrapper.appendChild half_cover
			zoo_slide_wrapper.appendChild prev.canvas_half
			zoo_slides_container.appendChild zoo_slide_wrapper

			if count == 0
				row = document.createElement 'DIV'
				row.className += ' row'
				row.appendChild zoo_slides_container
				zoo_slides_container_wrap.appendChild row
			else
				zoo_slides_container_wrap.lastElementChild.appendChild zoo_slides_container

			count = if count < 3 then count + 1 else 0
			
			zoo_slides_container.addEventListener 'mouseleave', () ->
				@.style.transform = 'scale(1)'
				@.style.zIndex = 0
			zoo_slides_container.addEventListener 'mousedown', () ->
				@.style.transform = 'scale(.9)'
				@.style.zIndex = 1
			zoo_slides_container.addEventListener 'mouseup', () ->
				@.style.transform = 'scale(1)'
				@.style.zIndex = 0


		document.body.appendChild zoo_slides_flex_jc_center		

	chopImage: (img, i) ->
		
		c = document.createElement 'CANVAS' or document.createElement 'canvas'
		c.className += ' unfold'
		c.style.animationDelay = i * .1 + 's'
		c.width = (img.width or img.naturalWidth) / 2
		c.height = img.height
		ctx = c.getContext '2d'
		ctx.drawImage img, (img.width or img.naturalWidth) / 2, 0, (img.width or img.naturalWidth) / 2, (img.height or img.naturalHeight), 0, 0, (img.width or img.naturalWidth) / 2, (img.height or img.naturalHeight)
		
		return c





# HERE IS WHERE THE CLIENT CREATES THE GALLERY >>>>>>>>>>>>>>>>>>>>>>>
zoogal = new ZooGal
data_sample = 
			hd:	[
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
				'http://placehold.it/640x480'
			]
			prev: [				
				'images/oxana1.jpg'				
				'images/oxana3.jpg'
				'images/oxana4.jpg'
				'images/oxana5.jpg'
				'images/03.jpg'
				'images/12.jpg'	
				'images/59.jpg'				
				'http://placehold.it/480x340'
				'http://placehold.it/480x340'
				'http://placehold.it/480x340'							
				'http://placehold.it/480x340'
				'http://placehold.it/480x340'
			]
zoogal.init data_sample				