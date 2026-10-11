---
layout: academic
title: "Publications"
permalink: /publications/
---

{% assign publications = site.data.publications %}
{% assign years = publications.papers | map: 'year' | uniq | sort | reverse %}
<p class="publication-intro">Please see my <a href="{{ publications.scholar_url | escape }}">Google Scholar profile</a> for citations.</p>
<div class="publication-sort" role="group" aria-label="Sort publications" hidden>
  <span class="publication-sort-label">Sort by</span>
  <button type="button" data-view="type" aria-pressed="true">Type</button>
  <button type="button" data-view="year" aria-pressed="false">Year</button>
</div>

<div class="publication-view" data-view-panel="type">
{% for section in publications.sections %}
{% assign section_papers = publications.papers | where: 'category', section.id %}
{% if section_papers.size > 0 %}
<section class="publication-section" aria-labelledby="{{ section.id | escape }}">
<h2 id="{{ section.id | escape }}" class="section-heading">{{ section.title | escape }}</h2>
<ol class="publication-list">
{% for year in years %}{% assign papers = section_papers | where: 'year', year %}{% for paper in papers %}{% include academic-publication.html paper=paper view="type" publications=publications %}{% endfor %}{% endfor %}
</ol>
</section>
{% endif %}
{% endfor %}
</div>

<div class="publication-view" data-view-panel="year" hidden>
{% for year in years %}
{% assign papers = publications.papers | where: 'year', year %}
<section class="publication-section" aria-labelledby="year-{{ year }}">
<h2 id="year-{{ year }}" class="section-heading">{{ year }}</h2>
<ul class="publication-list publication-list-plain">
{% for paper in papers %}{% include academic-publication.html paper=paper view="year" publications=publications %}{% endfor %}
</ul>
</section>
{% endfor %}
</div>

<script>
(function () {
  var buttons = document.querySelectorAll('.publication-sort button');
  var panels = document.querySelectorAll('[data-view-panel]');
  function show(view) {
    panels.forEach(function (p) { p.hidden = p.getAttribute('data-view-panel') !== view; });
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === view); });
  }
  document.querySelector('.publication-sort').hidden = false;
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var view = b.getAttribute('data-view');
      show(view);
      history.replaceState(null, '', view === 'year' ? '#by-year' : location.pathname);
    });
  });
  if (location.hash === '#by-year') show('year');

  document.querySelectorAll('.panel-toggle').forEach(function (b) {
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    panel.hidden = true;
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', open);
      panel.hidden = !open;
    });
  });
})();
</script>
{% include copy-button-script.html %}
