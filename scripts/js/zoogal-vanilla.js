var ZooGal, data_sample, zoogal;

ZooGal = (function() {
  function ZooGal() {}

  ZooGal.prototype.data = {
    count: 0,
    previews_loaded: 0,
    links: {},
    dom: [],
    temp: []
  };

  ZooGal.prototype.init = function(data) {
    var _this, array, i, img, j, k, len, len1, link, obj, ref, results, type, types;
    types = ['hd', 'prev'];
    for (i in data) {
      array = data[i];
      type = types.shift();
      this.data.links[type] = [];
      for (j = 0, len = array.length; j < len; j++) {
        link = array[j];
        this.data.links[type].push(link);
      }
    }
    this.data.count = this.data.links.prev.length;
    ref = this.data.links.prev;
    results = [];
    for (k = 0, len1 = ref.length; k < len1; k++) {
      link = ref[k];
      _this = this;
      obj = {};
      img = new Image();
      img.src = link;
      img.alt = '';
      this.data.temp.push(img);
      results.push(img.addEventListener('load', function() {
        return _this.previewsLoaded(_this.data.count);
      }));
    }
    return results;
  };

  ZooGal.prototype.previewsLoaded = function(count) {
    var canvas_half, i, img, j, len, obj, ref;
    this.data.previews_loaded++;
    if (this.data.previews_loaded === this.data.count) {
      ref = this.data.temp;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        img = ref[i];
        canvas_half = this.chopImage(img, i);
        img.draggable = false;
        img.addEventListener('dragstart', function(e) {
          if (e.preventDefault) {
            return e.preventDefault();
          }
        });
        obj = {
          img: img,
          canvas_half: canvas_half,
          width: img.width || img.naturalWidth,
          height: img.height || img.naturalHeight
        };
        this.data.dom.push(obj);
      }
      return this.buildMalenkyDOM();
    }
  };

  ZooGal.prototype.buildMalenkyDOM = function() {
    var count, half_cover, j, len, prev, ref, row, zoo_slide_wrapper, zoo_slides_container, zoo_slides_container_wrap, zoo_slides_flex_jc_center;
    zoo_slides_flex_jc_center = document.createElement('DIV');
    zoo_slides_flex_jc_center.className += 'zoo-slides-flex-jc_center';
    zoo_slides_container_wrap = document.createElement('DIV');
    zoo_slides_container_wrap.className += ' zoo-slides-container-wrap';
    zoo_slides_flex_jc_center.appendChild(zoo_slides_container_wrap);
    count = 0;
    ref = this.data.dom;
    for (j = 0, len = ref.length; j < len; j++) {
      prev = ref[j];
      zoo_slides_container = document.createElement('DIV');
      zoo_slides_container.className += ' zoo-slides-container col-xs-6 col-sm-6 col-md-3';
      zoo_slide_wrapper = document.createElement('DIV');
      zoo_slide_wrapper.className += ' zoo-slide-wrapper ready';
      half_cover = document.createElement('DIV');
      half_cover.className += ' half-cover';
      zoo_slide_wrapper.appendChild(prev.img);
      zoo_slide_wrapper.appendChild(half_cover);
      zoo_slide_wrapper.appendChild(prev.canvas_half);
      zoo_slides_container.appendChild(zoo_slide_wrapper);
      if (count === 0) {
        row = document.createElement('DIV');
        row.className += ' row';
        row.appendChild(zoo_slides_container);
        zoo_slides_container_wrap.appendChild(row);
      } else {
        zoo_slides_container_wrap.lastElementChild.appendChild(zoo_slides_container);
      }
      count = count < 3 ? count + 1 : 0;
      zoo_slides_container.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        return this.style.zIndex = 0;
      });
      zoo_slides_container.addEventListener('mousedown', function() {
        this.style.transform = 'scale(.9)';
        return this.style.zIndex = 1;
      });
      zoo_slides_container.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1)';
        return this.style.zIndex = 0;
      });
    }
    return document.body.appendChild(zoo_slides_flex_jc_center);
  };

  ZooGal.prototype.chopImage = function(img, i) {
    var c, ctx;
    c = document.createElement('CANVAS' || document.createElement('canvas'));
    c.className += ' unfold';
    c.style.animationDelay = i * .1 + 's';
    c.width = (img.width || img.naturalWidth) / 2;
    c.height = img.height;
    ctx = c.getContext('2d');
    ctx.drawImage(img, (img.width || img.naturalWidth) / 2, 0, (img.width || img.naturalWidth) / 2, img.height || img.naturalHeight, 0, 0, (img.width || img.naturalWidth) / 2, img.height || img.naturalHeight);
    return c;
  };

  return ZooGal;

})();

zoogal = new ZooGal;

data_sample = {
  hd: ['http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480'],
  prev: ['images/oxana1.jpg', 'images/oxana3.jpg', 'images/oxana4.jpg', 'images/oxana5.jpg', 'images/03.jpg', 'images/12.jpg', 'images/59.jpg', 'http://placehold.it/480x340', 'http://placehold.it/480x340', 'http://placehold.it/480x340', 'http://placehold.it/480x340', 'http://placehold.it/480x340']
};

zoogal.init(data_sample);
