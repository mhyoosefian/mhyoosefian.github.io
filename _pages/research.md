---
layout: academic
title: "Research"
description: "Research on certifiably stable state estimation under non-Gaussian noise, vision-based navigation (visual-inertial odometry) and analytical dynamics of multibody systems."
permalink: /research/
---

{% comment %}The text of this page is in _data/research.yml.{% endcomment %}
{% assign research = site.data.research %}
<div class="research-intro expandable">
  <div class="expandable-summary">{{ research.intro | markdownify }}</div>
  {% if research.intro_more %}<div class="expandable-more" id="more-intro">{{ research.intro_more | markdownify }}</div>{% endif %}
</div>

<ol class="research-list">
{% for d in research.directions %}
<li id="{{ d.id | escape }}" class="research-item expandable">
  <div class="research-figure">{% include research/{{ d.figure }}.html %}</div>
  <div class="research-text">
    <h2>{{ d.title | escape }}</h2>
    <div class="expandable-summary">{{ d.summary | markdownify }}</div>
    <div class="expandable-more" id="more-{{ d.id | escape }}">
      {{ d.details | markdownify }}
      {% if d.links %}<p class="research-related"><span>Related projects:</span> {% for l in d.links %}<a href="{{ l.url | relative_url }}">{{ l.label | escape }}</a>{% unless forloop.last %} · {% endunless %}{% endfor %}</p>{% endif %}
    </div>
  </div>
</li>
{% endfor %}
</ol>

<script>
// [more] / [less]: append a toggle to the last paragraph of each summary and hide the details
// (without JavaScript, everything stays visible).
document.querySelectorAll('.expandable').forEach(function (block) {
  var more = block.querySelector('.expandable-more'), paras = block.querySelectorAll('.expandable-summary > p');
  if (!more || !paras.length) return;
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'more-toggle'; btn.textContent = '[more]';
  btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', more.id);
  more.hidden = true;
  btn.addEventListener('click', function () {
    var open = more.hidden; more.hidden = !open;
    btn.textContent = open ? '[less]' : '[more]'; btn.setAttribute('aria-expanded', String(open));
  });
  var last = paras[paras.length - 1]; last.appendChild(document.createTextNode(' ')); last.appendChild(btn);
});
</script>
