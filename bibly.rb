#!/usr/bin/env ruby

require 'optparse'
require 'uri'
require 'open-uri'
require 'nokogiri'

DB = 'http://dblp.uni-trier.de/rec/bibtex1/'
SELECTOR = '#bibtex-section > pre'

def get(key)
  begin
    Nokogiri::HTML(open(URI.join(DB,key))).css(SELECTOR).first.text.    gsub(/DBLP:/,'')
  rescue OpenURI::HTTPError
    puts "WARNING: no record found for key '#{key}''"
    nil
  end
end

OptionParser.new do |opts|
  opts.banner = "Usage: #{File.basename $0} [options] FILES"
  opts.separator ""
  opts.on("-h", "--help", "Show this message.") do
    puts opts
    exit
  end
end.parse!

exit if ARGF.eof?

ARGF.each do |key|
  puts get(key.strip)
end
