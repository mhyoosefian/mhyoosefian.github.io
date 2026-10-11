---
layout: academic
title: "News"
permalink: /news/
---

<ul class="news-list">
{% for item in site.data.news %}  <li><span class="news-date">{{ item.date | escape }}</span><span class="news-text">{{ item.text | markdownify | remove: '<p>' | remove: '</p>' | strip }}{% if item.paper %} <a class="news-tag" href="{{ '/publications/' | relative_url }}#{{ item.paper | escape }}">[paper]</a>{% endif %}{% if item.slides %} <a class="news-tag" href="{{ item.slides | relative_url }}" target="_blank" rel="noopener">[slides]</a>{% endif %}{% if item.video %} <a class="news-tag" href="{{ item.video | relative_url }}" target="_blank" rel="noopener">[video]</a>{% endif %}</span></li>
{% endfor %}</ul>
