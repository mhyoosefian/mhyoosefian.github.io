# mhyoosefian.github.io

Source of my academic website, **https://mhyoosefian.github.io**, built with [Jekyll](https://jekyllrb.com/) and published by GitHub Pages from the `master` branch. It started from the [AcademicPages](https://github.com/academicpages/academicpages.github.io) template (MIT license, see `LICENSE`).

## Where things are

| To change | Edit |
|---|---|
| Menu (order, hiding a page) | `_data/navigation.yml` |
| Sidebar links (email, Scholar, GitHub, …) | `_data/profile.yml` |
| Name and title under the photo | `_config.yml` (`name`, `description`) |
| About page | `_pages/about.md` |
| Research page | `_data/research.yml` (text); diagrams in `_includes/research/` |
| Publications | `_data/publications.yml`; paper PDFs in `files/papers/` (see `PUBLICATIONS.md`) |
| Projects | one folder per project in `projects/<name>/index.md`, with its figures and videos; start from `projects/_template/`; categories in `_data/project_categories.yml` |
| CV | `_pages/cv.md`; the PDF is `files/mhyoosefian-cv.pdf` (update `cv_updated:` at the top of `cv.md` too) |
| News | `_data/news.yml` (newest first); slides in `files/slides/` |
| Blog | one file per post in `_posts/YYYY-MM-DD-name.md`; images in `files/blog/` |
| Look of the site | `assets/css/academic.css`; page frame in `_layouts/academic.html` |
| WALL·E footer animation | `assets/walle/` |

## Preview locally

```bash
LANG=en_US.UTF-8 PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH bundle exec jekyll serve --livereload
```

Then open http://127.0.0.1:4000. The page refreshes on its own after each save (restart the command after editing `_config.yml`).

## Publish

```bash
git add -A
git commit -m "Describe the change"
git push
```

GitHub rebuilds the site within a couple of minutes (progress in the repository's **Actions** tab).
