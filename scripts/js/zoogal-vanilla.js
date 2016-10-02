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
    var canvas_fold_x, canvas_fold_y, canvas_folds, i, img, j, len, obj, ref;
    this.data.previews_loaded++;
    if (this.data.previews_loaded === this.data.count) {
      ref = this.data.temp;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        img = ref[i];
        canvas_folds = this.chopImage(img, i);
        canvas_fold_x = canvas_folds[0];
        canvas_fold_y = canvas_folds[1];
        img.draggable = false;
        img.addEventListener('dragstart', function(e) {
          if (e.preventDefault) {
            return e.preventDefault();
          }
        });
        obj = {
          img: img,
          canvas_fold_x: canvas_fold_x,
          canvas_fold_y: canvas_fold_y,
          width: img.width || img.naturalWidth,
          height: img.height || img.naturalHeight
        };
        this.data.dom.push(obj);
      }
      return this.buildMalenkyDOM();
    }
  };

  ZooGal.prototype.buildMalenkyDOM = function() {
    var count, half_cover, j, len, prev, quarter_cover, ref, row, zoo_slide_wrapper, zoo_slides_container, zoo_slides_container_wrap, zoo_slides_flex_jc_center;
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
      zoo_slide_wrapper.className += ' zoo-slide-wrapper ready settle';
      half_cover = document.createElement('DIV');
      half_cover.className += ' half-cover';
      quarter_cover = document.createElement('DIV');
      quarter_cover.className += ' quarter-cover';
      quarter_cover.style.animationDelay = prev.canvas_fold_y.style.animationDelay;
      zoo_slide_wrapper.appendChild(prev.img);
      zoo_slide_wrapper.appendChild(half_cover);
      zoo_slide_wrapper.appendChild(prev.canvas_fold_x);
      zoo_slide_wrapper.appendChild(quarter_cover);
      zoo_slide_wrapper.appendChild(prev.canvas_fold_y);
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
      zoo_slide_wrapper.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        return this.style.transition = 'initial';
      });
      zoo_slide_wrapper.addEventListener('mousedown', function() {
        this.style.transition = 'all .2s';
        return this.style.transform = 'scale(.9)';
      });
      zoo_slide_wrapper.addEventListener('mouseup', function() {
        return this.style.transform = 'scale(1)';
      });
    }
    return document.body.appendChild(zoo_slides_flex_jc_center);
  };

  ZooGal.prototype.stackify = function() {
    var c, centerpointX, centerpointY, factor, i, img, img_offset_left_normalize, j, len, maxX, maxY, minX, minY, obj, ordered_items, prev, ref, results, xpos, ypos;
    centerpointX = window.innerWidth / 2;
    centerpointY = 100;
    minX = 100;
    maxX = centerpointX + 100;
    minY = centerpointY - 50;
    maxY = centerpointY + 50;
    obj = {};
    ref = this.data.dom;
    for (j = 0, len = ref.length; j < len; j++) {
      prev = ref[j];
      factor = Math.random();
      img_offset_left_normalize = prev.img.parentNode.parentNode.offsetLeft;
      xpos = minX + (1 + (factor * ((maxX - minX) / 100)) * 100) - prev.img.parentNode.parentNode.offsetLeft;
      ypos = minY + (1 + factor * ((maxY - minY) / 100) * 100) - prev.img.parentNode.parentNode.offsetTop;
      obj[xpos + prev.img.parentNode.parentNode.offsetLeft] = prev.img;
      if (Math.round(factor) === 0) {
        factor = factor * -1;
      }
      prev.img.parentNode.style.transform = 'translateX(' + xpos + 'px)' + ' translateY(' + ypos + 'px)' + ' rotate(' + factor * 45 + 'deg)';
    }
    ordered_items = {};
    Object.keys(obj).sort(function(a, b) {
      return a - b;
    }).forEach(function(key) {
      return ordered_items[key] = obj[key];
    });
    c = 0;
    results = [];
    for (i in ordered_items) {
      img = ordered_items[i];
      console.log(i, img.src);
      img.parentNode.style.zIndex = c;
      results.push(c++);
    }
    return results;
  };

  ZooGal.prototype.chopImage = function(img, index) {
    var c, canvas_folds, classname, css, ctx, delays, heights, i, j, lag, len, width, y_coords;
    css = [' fold-x unfold-x', ' fold-y unfold-y'];
    heights = [img.height || img.naturalHeight, (img.height || img.naturalHeight) / 2];
    width = (img.width || img.naturalWidth) / 2;
    y_coords = [0, (img.height || img.naturalHeight) / 2];
    delays = [.85, .35];
    canvas_folds = [];
    for (i = j = 0, len = css.length; j < len; i = ++j) {
      classname = css[i];
      c = document.createElement('CANVAS' || document.createElement('canvas'));
      c.className += css[i];
      lag = index * 0.2;
      c.style.animationDelay = delays[i] + lag + 's';
      c.width = (img.width || img.naturalWidth) / 2;
      c.height = heights[i];
      ctx = c.getContext('2d');
      ctx.drawImage(img, width, y_coords[i], width, heights[i], 0, 0, width, heights[i]);
      canvas_folds.push(c);
    }
    return canvas_folds;
  };

  return ZooGal;

})();

zoogal = new ZooGal;

data_sample = {
  hd: ['http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480', 'http://placehold.it/640x480'],
  prev: ['images/1.jpg', 'images/2.jpg', 'images/1.jpg', 'images/2.jpg', 'images/1.jpg', 'images/2.jpg', 'images/1.jpg', 'images/2.jpg', 'images/1.jpg', 'images/2.jpg', 'images/1.jpg']
};

zoogal.init(data_sample);
