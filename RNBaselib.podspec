require 'json'
version = JSON.parse(File.read('package.json'))["version"]

Pod::Spec.new do |s|

  s.name            = "RNBaselib"
  s.version         = version
  s.homepage        = "https://github.com/evel-pig/rn-baselib"
  s.summary         = "A <RNBaselib /> component for react-native"
  s.license         = "MIT"
  s.author          = { "Brent Vatne" => "qq05629@126.com" }
  s.ios.deployment_target = '8.0'
  s.tvos.deployment_target = '9.0'
  s.source          = { :git => "https://github.com/evel-pig/rn-baselib.git", :tag => "v#{s.version}" }
  s.source_files    = 'RNBaselib/*.{h,m}'
  s.requires_arc = true
  s.preserve_paths  = "**/*.js"

  s.dependency 'React'

end