---
layout: academic
title: "Research"
description: "Research on certifiably stable state estimation under non-Gaussian noise, vision-based navigation (visual-inertial odometry) and analytical dynamics of multibody systems."
permalink: /research/
---

{% comment %}The text of this page is in _data/research.yml.{% endcomment %}
{% assign research = site.data.research %}
<div class="research-intro">{{ research.intro | markdownify }}</div>

<ol class="research-list">
{% for d in research.directions %}
<li id="{{ d.id | escape }}" class="research-item">
  <div class="research-figure">{% include research/{{ d.figure }}.html %}</div>
  <div class="research-text">
    <h2>{{ d.title | escape }}</h2>
    <p>{{ d.summary | markdownify | remove: '<p>' | remove: '</p>' | strip }}{% for id in d.papers %} <a class="research-tag" href="{{ '/publications/' | relative_url }}#{{ id | escape }}">[paper{% if d.papers.size > 1 %}{{ forloop.index }}{% endif %}]</a>{% endfor %}</p>
    {% if d.links %}<p class="research-related"><span>Related projects:</span> {% for l in d.links %}<a href="{{ l.url | relative_url }}">{{ l.label | escape }}</a>{% unless forloop.last %} · {% endunless %}{% endfor %}</p>{% endif %}
  </div>
</li>
{% endfor %}
</ol>
