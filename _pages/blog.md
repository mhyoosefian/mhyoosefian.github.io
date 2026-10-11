---
layout: academic
title: "Blog"
permalink: /blog/
---

{% comment %}Lists the posts in _posts/, newest first. A series appears once, through its first part.
An optional `thumbnail` (path to an image) shows a picture next to the post.{% endcomment %}
<ul class="post-list">
{% for post in site.posts %}{% if post.series and post.part != 1 %}{% continue %}{% endif %}
  <li class="post-card">
    {% if post.thumbnail %}<a class="post-thumb" href="{{ post.url | relative_url }}" tabindex="-1" aria-hidden="true"><img src="{{ post.thumbnail | relative_url }}" alt="" loading="lazy"></a>{% endif %}
    <div>
      <p class="post-meta"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %Y" }}</time>{% if post.series %}{% assign parts = site.posts | where: 'series', post.series %} · {{ parts.size }}-part series{% endif %}</p>
      <h2><a href="{{ post.url | relative_url }}">{% if post.series %}{{ post.series_title | escape }}{% else %}{{ post.title | escape }}{% endif %}</a></h2>
      {% if post.series_summary or post.summary %}<p>{{ post.series_summary | default: post.summary | escape }}</p>{% endif %}
    </div>
  </li>
{% endfor %}
</ul>
