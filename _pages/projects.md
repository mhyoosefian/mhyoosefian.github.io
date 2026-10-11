---
layout: academic
title: "Projects"
permalink: /projects/
---

{% comment %}Lists every page that uses `layout: project` (one folder per project in projects/). See projects/_template/index.md.{% endcomment %}
{% assign projects = site.pages | where: 'layout', 'project' | sort: 'start' | reverse %}
<p class="publication-intro">You can find detailed descriptions of my past and recent projects (done during my M.Sc. and Ph.D.), with codes, papers, videos and figures. You can filter by category.</p>

<div class="project-controls" hidden>
  <div class="project-filter" role="group" aria-label="Filter by category">
    <button type="button" data-category="all" aria-pressed="true">All</button>
    {% for c in site.data.project_categories %}<button type="button" data-category="{{ c.id }}" aria-pressed="false">{{ c.label | escape }}</button>
    {% endfor %}
  </div>
</div>

<ul class="project-grid">
{% for p in projects %}
<li class="project-card" data-categories="{{ p.categories | join: ' ' }}" data-start="{{ p.start }}">
  <a class="project-thumb" href="{{ p.url | relative_url }}" tabindex="-1" aria-hidden="true">{% if p.thumbnail %}<img src="{% if p.thumbnail contains '://' %}{{ p.thumbnail }}{% else %}{{ p.url | relative_url }}{{ p.thumbnail }}{% endif %}" alt="" loading="lazy">{% else %}<span class="project-thumb-placeholder">{{ p.title | slice: 0 }}</span>{% endif %}</a>
  <div class="project-card-body">
    <p class="project-dates">{% include project-dates.html project=p %}</p>
    <h2><a href="{{ p.url | relative_url }}">{{ p.title | escape }}</a></h2>
    <p class="project-summary">{{ p.summary | escape }}</p>
    <ul class="project-categories" aria-label="Categories">{% for c in p.categories %}{% assign cat = site.data.project_categories | where: 'id', c | first %}<li>{{ cat.label | default: c }}</li>{% endfor %}</ul>
    {% include project-links.html project=p %}
  </div>
</li>
{% endfor %}
</ul>
<p class="project-empty" hidden>No projects in this category yet.</p>

<script>
(function () {
  var grid = document.querySelector('.project-grid');
  var cards = Array.prototype.slice.call(grid.children);
  var filterButtons = document.querySelectorAll('.project-filter button');
  var empty = document.querySelector('.project-empty');
  var state = { category: 'all' };
  document.querySelector('.project-controls').hidden = false;

  function render() {
    var shown = 0;
    cards.forEach(function (card) {
      var match = state.category === 'all' || (' ' + card.getAttribute('data-categories') + ' ').indexOf(' ' + state.category + ' ') !== -1;
      card.hidden = !match;
      if (match) shown++;
    });
    empty.hidden = shown > 0;
    filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-category') === state.category); });
  }
  filterButtons.forEach(function (b) { b.addEventListener('click', function () {
    state.category = b.getAttribute('data-category');
    history.replaceState(null, '', state.category === 'all' ? location.pathname : '#' + state.category);
    render();
  }); });
  var hash = location.hash.slice(1);
  if (hash && document.querySelector('.project-filter [data-category="' + hash + '"]')) state.category = hash;
  render();
})();
</script>
