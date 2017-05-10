/* use strict */

var assets = [
    {url: 'img/bakgrund3.png', x: -150, y: -110, offset: -0.5},
	{url: 'img/moln1.png', x: -150, y: 100, offset: -0.4},
	{url: 'img/moln2.png', x: 100, y: 50, offset: -0.4},
	{url: 'img/moln3.png', x: 350, y: 150, offset: -0.4},
    {url: 'img/nr2.png', x: -250, y: 20, offset: -0.3},
    {url: 'img/nr3.png', x: -210, y: 0, offset: -0.2},
    {url: 'img/nr4.png', x: -210, y: 0, offset: -0.1},
    {url: 'img/Start-game2.png', x: 60, y: 166, offset: 0.1},
    {url: 'img/4-border.svg', x: 20, y: 20, offset: 0},
    {url: 'img/4-mask.svg', x: 0, y: 0, offset: 0}
  ],
      layers = [],
      w = 505,
      h = 460,
      loaded = 0,
      cont = document.getElementById('cont'),
      s = new Snap(w, h),
      grad,
      gradEl;


  cont.appendChild(s.node);

  g = s.g();
  c = s.g();
  c.attr({transform: 'scale(1)'});
  g.append(c);

  for (var i = 0; i < assets.length; i++) {
    var img = new Image();
    img.src = assets[i].url;
    img.onload = handle_load;

    var _img = s.image(assets[i].url, assets[i].x, assets[i].y);
    c.append(_img);
    layers.push(_img);
  }


  function handle_load(e) {
    loaded += 1;

    if (loaded == assets.length) {
      handle_loaded();
    }
  }

  function handle_loaded() {

    var _mask = layers[layers.length - 1];
    g.attr({mask: _mask});

    createGradient();

    cont.addEventListener('mousemove', handle_mousemove);
    cont.addEventListener('mouseout', handle_mouseout);
    cont.addEventListener('mouseover', handle_mouseover);
	document.getElementById("cont").onclick = function () {
        location.href = "game.html";
    };
	
  }

  function handle_mousemove(e) {
    var dx = e.offsetX - (w / 2);
    var dy = e.offsetY - (h / 2);

    for (var i = 0; i < layers.length; i += 1) {
      var l = layers[i];
      var _x = dx * assets[i].offset;
      var _y = dy * assets[i].offset;
      TweenMax.to(l.node, 0.1, {x: _x, y: _y});
    }

    updateGradient(e);
    TweenMax.to(s.node, 0.2, {rotationY: dx / 10, rotationX: -dy / 10});
  }

  function handle_mouseout(e) {
    for (var i = 0; i < layers.length; i += 1) {
      var l = layers[i];
      TweenMax.to(l.node, 0.2, {x: 0, y: 0, ease: Quad.easeOut});
    }

    TweenMax.to(s.node, 0.2, {scale: 0.9, rotationY: 0, rotationX: 0, ease: Quad.easeOut});
    TweenMax.to(c.node, 1, {rotationY: 0, rotationX: 0});
  }

  function handle_mouseover(e) {
    TweenMax.to(s.node, 0.2, {scale: 1.5, ease: Back.easeOut});
  }

  function createGradient() {
    grad = s.gradient("l(0, 0, 1, 1)rgba(0,0,0,0.5)-rgba(0,0,0,0):75");

    gradEl = s.rect(0, 0, w, h);
    gradEl.attr({fill: grad, opacity: 0});

    g.append(gradEl);
  }

  function updateGradient(e) {
    var dx = e.offsetX - (w / 2);
    var dy = e.offsetY - (h / 2);
    var angle = Math.atan2(dy, dx);
    var points = angleToPoints(angle);

    var _opacity = Math.sqrt((dx * dx) + (dy * dy));

    grad.attr(points);
    TweenMax.to(gradEl.node, 0.1, {opacity: _opacity / (w / 2)});
  }

  function angleToPoints(angle) {
    var segment = Math.floor(angle / Math.PI * 2) + 2;
    var diagonal =  (1/2 * segment + 1/4) * Math.PI;
    var op = Math.cos(Math.abs(diagonal - angle)) * Math.sqrt(2);
    var x = op * Math.cos(angle);
    var y = op * Math.sin(angle);

    return {
      x1: x < 0 ? 1 : 0,
      y1: y < 0 ? 1 : 0,
      x2: x >= 0 ? x : x + 1,
      y2: y >= 0 ? y : y + 1
    };
  }
  
  