# Bibly

Bibly converts a sequence of DBLP keys into BibTeX entries.

Input keys are read from standard input or files specified on the command line.
Each line contans a single key. For instance, if the file `some.keys` contains
the following two lines

    conf/popl/CousotC77
    conf/popl/CousotC79

then the commands `./bibly.rb some.keys` and `cat some.keys | ./bibly.rb` output

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
    conf/popl/CousotC79

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

Multiple key files may be given as arguments.
