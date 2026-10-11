# Adding and updating publications

The publication page is generated from **`_data/publications.yml`**. Edit that file for all routine publication changes. The page template handles grouping (by type or by year, chosen by the reader), numbering, newest-year-first ordering, name highlighting, abstracts, and resource buttons automatically.

The new website is currently a local preview on the `design/academic-refresh` branch. Local edits do not change the live website. The new layout and data file must be published together before this workflow is available on your live site.

## Add a publication

1. Open `_data/publications.yml` in a text editor.
2. Under `papers:`, copy one complete entry, from its `- id:` line up to (but not including) the next `- id:` line.
3. Give the copy a unique `id`. Use lowercase words separated by hyphens, such as `new-estimation-paper`.
4. Replace the title, authors, venue, year, category, status, abstract, and links. Preserve author order.
5. Save the file, rebuild, and inspect the local publication page as described below.

This is an example to fill in, not a real publication:

```yaml
  - id: new-estimation-paper
    category: conference
    title: "Your Full Paper Title"
    authors:
      - "M. H. Yoosefian Nooshabadi"
      - "L. Lessard"
    venue: "Your Conference or Journal Name"
    year: 2026
    status: "Published"
    abstract: >-
      Paste the abstract here as plain text. It can span several lines;
      every line must be indented by six spaces.
    links:
      - label: "Link"
        url: "https://doi.org/REPLACE-WITH-YOUR-DOI"
      - label: "PDF"
        url: "/files/papers/your-paper.pdf"
      - label: "Code"
        url: "https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY"
```

Keep `papers:` only once. Paste new entries at the same indentation as the existing entries. Use spaces, not tabs. Keep quotation marks around text, particularly titles containing a colon. A double quote inside quoted text must be escaped as `\"`. Keep `year` as an unquoted number.

## Fields

| Field | What to enter |
| --- | --- |
| `id` | Required unique identifier; also becomes a link anchor, e.g. `/publications/#regularized-correntropy`. Keep it stable when modifying a paper. |
| `category` | Required: `journal`, `conference`, or `preprint`. Must match an `id` under `sections`. |
| `title` | Required full title. Do not add HTML or Markdown. |
| `authors` | Required list of authors, one quoted name per line, in publication order. |
| `venue` | Required journal or conference name. The template italicizes it. |
| `year` | Required numeric publication year (for a preprint, the year it was written or posted). Controls sorting and the year headings. |
| `status` | Use `Published`, `Submitted`, `Under review`, `Accepted`, or `Preprint`. All values except `Published` produce a visible label. Status never updates automatically. |
| `details` | Optional volume, issue, pages, article number, or location, e.g. `"32(2), e6891"`. Omit the year here; it is printed separately. |
| `language` | Optional, e.g. `"Persian"`; renders as `(In Persian)`. |
| `note` | Optional plain-text note, such as a conference presentation of a journal article. |
| `abstract` | Optional plain-text abstract, written after `abstract: >-` as an indented block (see the example). Shows an **Abstract** button that expands it. Do not add HTML or Markdown. |
| `links` | Optional list of `label` and `url` pairs, each shown as a small button. Use labels such as `Link`, `PDF`, `arXiv`, `Code`, or `Slides`. A link with an empty `url` is hidden. Omit the whole list if there are no links. |

Your name is automatically bolded when an author matches the `highlight_author` value at the top of the file: **`M. H. Yoosefian Nooshabadi`**. Use exactly that spelling and spacing in your entries.

Readers can switch between **Type** (Journal Papers, Conference Papers, Preprints) and **Year** with the *Sort by* buttons; `/publications/#by-year` opens the year view directly. In both views papers are newest year first, and papers from the same year keep their order in the file, so swap two blocks to reorder them. Numbering restarts at 1 for each category in the type view. Sections are shown in the order listed under `sections:`, and an empty section is skipped.

The Google Scholar link is controlled by `scholar_url` at the top of the file.

Co-author names become links when they appear under `coauthors:` near the top of the file, as `"Name exactly as in authors": "profile URL"`. A new co-author needs one new line there; it then applies to every paper they appear on. Names not listed (and your own name) stay plain text.

## Modify or remove a publication

Find its `id` or title and edit that entry in place. Do not create a second copy just to change its status.

For example, after the correntropy paper is accepted, change:

```yaml
    status: "Submitted"
```

to:

```yaml
    status: "Accepted"
```

When the proceedings are published, use `Published`, confirm the title, venue and year, then add pages and a paper URL. Remove an entry by deleting its complete block, leaving the next `- id:` line intact.

If a journal paper is also presented at a conference, a `note` can record the presentation without duplicating the journal article. Add a separate conference entry only if there is a distinct conference publication you want to list.

## Add a PDF or another resource

1. Put a web-ready PDF in `files/papers/`, for example `files/papers/my-paper.pdf`. Everything in this folder is published with the website (GitHub Pages serves it), so anyone can download it once the site is live. Only add versions you are allowed to share, usually the accepted manuscript or arXiv version rather than the publisher's typeset PDF. Keep each file under 100 MB (GitHub's limit).
2. Add this item under the paper's existing `links:` list:

```yaml
      - label: "PDF"
        url: "/files/papers/my-paper.pdf"
```

Use a publisher/DOI URL for `Link`, a direct file URL for `PDF`, and a repository URL for `Code`. Do not use a path from your computer such as `/Users/...`. Delete example URLs before saving.

## Preview on this Mac

Open Terminal in the `myWebsite` folder and enter:

```bash
cd website
LANG=en_US.UTF-8 PATH=/opt/homebrew/opt/ruby@3.3/bin:$PATH bundle exec jekyll build
```

`LANG=en_US.UTF-8` avoids an "Invalid US-ASCII character" error when the shell has no UTF-8 locale set.

If the preview server from this chat is still running, refresh:

<http://127.0.0.1:4000/publications/>

If it is not running, start it from the same `website` folder:

```bash
python3 -m http.server 4000 --bind 127.0.0.1 --directory _site
```

Leave that Terminal window open while viewing the website. Rebuild after each edit, then refresh the browser. If Terminal says port 4000 is already in use, the existing server may still be running; try the preview URL. Press Control-C to stop a server you started.

If Jekyll reports a YAML error, check indentation, quotation marks, and the line mentioned in the error. Do not edit `_site/publications/index.html`: it is generated and will be overwritten on the next build.

## Publish later

The preview is local. To update GitHub Pages, the changes must be committed and pushed to the repository, then merged into the branch configured as the Pages source (normally `master` for this repository). GitHub must finish a successful Pages deployment before the public site updates.

Once this redesign has been published, you can also edit `_data/publications.yml` on GitHub:

1. Open `mhyoosefian/mhyoosefian.github.io` and select the appropriate branch.
2. Open `_data`, then `publications.yml`.
3. Use the pencil/Edit button, make the same YAML edits, and review the diff.
4. Commit to a new branch and create a pull request, or commit to the publishing branch if you intend an immediate live update.
5. After merging, check the repository's Actions/Pages deployment result and visit the public Publications page.

For routine updates, include `_data/publications.yml` and any new PDFs in `files/papers/`. The initial redesign also needs its layout, CSS, pages, image, and configuration changes; publishing the data file alone will not install the new design.

## Implementation files

- `_data/publications.yml`: publication content; edit this most often.
- `_pages/publications.md`: page introduction, the Type/Year views, and the small script for the sort and abstract buttons.
- `_includes/academic-publication.html`: how one citation is rendered (shared by both views).
- `assets/css/academic.css`: visual styling, in the publication rules near the end.
- `_layouts/academic.html`: shared website layout.

## Source reconciliation for this first version

The list combines `mhyoosefian-resume.pdf` and `MHYoosefian_CV.docx`. The first version had nine papers; the two Persian-language conference papers (from the Word CV only) were later removed at the owner's request, leaving seven. Author order and available links were retained. The PDF generally supersedes older Word entries.

The following metadata was checked against primary sources:

- **Volterra equations:** both CVs say 2021, but the [publisher's citation](https://scientiairanica.sharif.edu/article_23551.html) identifies the final publication as 2025, volume 32(2), e6891. The website uses 2025.
- **Stealthy range-sensor placement:** the PDF says 2025 and the older Word CV lists a submitted ACC version. [Laurent Lessard's publication list](https://laurentlessard.com/publications/) identifies the journal paper as December 2024, volume 8, pages 2763–2768. His [ACC 2025 report](https://laurentlessard.com/acc25-in-denver/) confirms the conference presentation. It is listed once as a 2024 journal article, with a note about ACC 2025.
- **Fast MSCKF:** the PDF's 2024 date replaces the Word CV's 2022 date; the [publisher record](https://www.sciencedirect.com/science/article/pii/S0016003224005519) supports 2024.
- **Dynamic-programming estimation:** the full title includes “with Non-Gaussian Measurement Noise,” as confirmed by the [author's arXiv record](https://arxiv.org/abs/2509.05482) and coauthor's publication list. Its 2025 date is unchanged.
- **Regularized correntropy:** listed as a 2026 preprint, submitted to ACC 2027. No acceptance, DOI, or public paper link is assumed. Its PDF is deliberately not posted yet; when it should be, copy `papersPDFs/nooshabadi2026divergence.pdf` to `files/papers/` and add a `PDF` link.
- **Abstracts and PDFs:** abstracts were taken from the PDFs in the outer `papersPDFs/` folder, with only obvious typos corrected ("Positinoing", "Arial"). The Fast MSCKF PDF is the arXiv version ([2210.08117](https://arxiv.org/abs/2210.08117)), also linked as arXiv. Only the Scientia Iranica PDF is the publisher's version, published open access under CC BY-NC-ND.
