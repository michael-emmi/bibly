#!/usr/bin/env ruby

require 'optparse'

OptionParser.new do |opts|
  opts.banner = "Usage: #{File.basename $0} [options] FILES"
  opts.separator ""
  opts.on("-h", "--help", "Show this message.") do
    puts opts
    exit
  end
end.parse!

exit unless ARGV.length == 1

puts %x(
  latex -interaction nonstopmode #{ARGV.first} \
  | grep Citation \
  | awk -F[\\`\\'] '{print $2}' \
  | sort \
  | uniq \
  | #{File.dirname(__FILE__)}/bibly.rb
)
