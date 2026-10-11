---
# HOW TO ADD A PROJECT
# 1. Copy this whole _template folder and rename the copy, e.g. projects/my-new-project/
#    (lowercase, hyphens, no spaces). The folder name becomes the web address:
#    /projects/my-new-project/
#    Folders starting with "_" (like this one) are never published.
# 2. Put the project's images in the same folder (e.g. cover.jpg, figure1.png).
#    Keep images small (ideally < 1 MB each). Upload videos to YouTube instead of here.
# 3. Fill in the fields below, write the page text under the second "---", rebuild.

layout: project            # keep as is
title: "Project title"
start: 2024-01             # YYYY-MM; used for sorting by date
end: 2024-06               # YYYY-MM, or present, or delete the line for a single month
categories:                # ids from _data/project_categories.yml (one or more)
  - state-estimation
  - control
summary: "One or two sentences shown on the project card."
thumbnail: cover.jpg       # image in this folder (or a full https:// image URL) shown on the card; delete for none
publication: ""            # id of the paper in _data/publications.yml (adds a Paper button), or ""
links:                     # extra buttons; delete any you don't need
  - label: "Code"
    url: "https://github.com/mhyoosefian/REPOSITORY"
  - label: "Video"
    url: "https://www.youtube.com/watch?v=VIDEO_ID"
cite: ""                   # paper id(s) from _data/publications.yml shown in a Citation section at the
                           # bottom (with BibTeX), e.g. fast-msckf, or a list [id1, id2]; "" for none
---

## Overview

What problem does the project address and why does it matter?

## Approach

How you solved it. Markdown works here: **bold**, *italic*, lists, links, and math in plain text.

{% include project-figure.html src="figure1.png" alt="Describe the image" caption="Figure caption." %}

## Results

What you found. To embed a YouTube video, use its id (the part after `watch?v=`):

{% include project-video.html id="VIDEO_ID" caption="Video caption." %}
