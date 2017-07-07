[![Build Status](https://travis-ci.org/michael-emmi/bibly.svg?branch=master)](https://travis-ci.org/michael-emmi/bibly)
[![npm version](https://badge.fury.io/js/bibly.svg)](https://badge.fury.io/js/bibly)

# Bibly

Bibly simplifies the creation and maintenance of bibliographies in LaTeX
documents by fetching the [BibTex][] entries corresponding to LaTeX citations.

# Requirements

* [Node.js][]

# Installation

    $ npm i -g bibly

# Usage

Create a file named `bibly.json` in your LaTeX working directory like this:

    {
      "latex": "draft.tex",
      "databases": {
        "DBLP": {
          "url": "http://dblp.uni-trier.de/rec/bibtex1",
          "file": "dblp.bib"
        }
      }
    }

substituting the name of your LaTeX source file for `draft.tex`. Then just run

    $ bibly

Bibly will then locate your citations of the form `DB:key`, fetch the records
from the specified web database, then write them to the specified file. For
instance, given the citations `\cite{DBLP:conf/popl/CousotC77}` and
`\cite{DBLP:conf/popl/CousotC79}` from `draft.tex` and the `bibly.json` file
listed above, Bibly will populate the file `dblp.bib` with the following
records:

    @inproceedings{conf/popl/CousotC77,
      author    = {Patrick Cousot and
                   Radhia Cousot},
      editor    = {Robert M. Graham and
                   Michael A. Harrison and
                   Ravi Sethi},
      title     = {Abstract Interpretation: {A} Unified Lattice Model for Static Analysis
                   of Programs by Construction or Approximation of Fixpoints},
      booktitle = {Conference Record of the Fourth {ACM} Symposium on Principles of Programming
                   Languages, Los Angeles, California, USA, January 1977},
      pages     = {238--252},
      publisher = {{ACM}},
      year      = {1977},
      url       = {http://doi.acm.org/10.1145/512950.512973},
      doi       = {10.1145/512950.512973},
      timestamp = {Mon, 21 May 2012 16:19:51 +0200},
      biburl    = {http://dblp.uni-trier.de/rec/bib/conf/popl/CousotC77},
      bibsource = {dblp computer science bibliography, http://dblp.org}
    }

    @inproceedings{conf/popl/CousotC79,
      author    = {Patrick Cousot and
                   Radhia Cousot},
      editor    = {Alfred V. Aho and
                   Stephen N. Zilles and
                   Barry K. Rosen},
      title     = {Systematic Design of Program Analysis Frameworks},
      booktitle = {Conference Record of the Sixth Annual {ACM} Symposium on Principles
                   of Programming Languages, San Antonio, Texas, USA, January 1979},
      pages     = {269--282},
      publisher = {{ACM} Press},
      year      = {1979},
      url       = {http://doi.acm.org/10.1145/567752.567778},
      doi       = {10.1145/567752.567778},
      timestamp = {Mon, 21 May 2012 16:19:51 +0200},
      biburl    = {http://dblp.uni-trier.de/rec/bib/conf/popl/CousotC79},
      bibsource = {dblp computer science bibliography, http://dblp.org}
    }

This can be run each time new citations are added.

# Development

Emulate installation of local repository:

    $ npm link

Release a new version to npm:

    $ npm version [major|minor|patch]
    $ npm publish

[Node.js]: https://nodejs.org
[BibTex]: http://www.bibtex.org
[dblp]: http://dblp.uni-trier.de
