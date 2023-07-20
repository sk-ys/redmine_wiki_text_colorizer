require_dependency File.expand_path('../lib/wiki_text_colorizer/hooks.rb', __FILE__)

Redmine::Plugin.register :redmine_wiki_text_colorizer do
  name 'Redmine Wiki Text Colorier plugin'
  author 'sk-ys'
  description 'This is a plugin for Redmine'
  version '0.1.0'
  url 'https://github.com/sk-ys/redmine_wiki_text_colorizer'
  author_url 'https://github.com/sk-ys'
end
