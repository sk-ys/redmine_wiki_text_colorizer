require_dependency File.expand_path('../lib/wiki_text_colorizer/hooks.rb', __FILE__)

Redmine::Plugin.register :redmine_wiki_text_colorizer do
  name 'Redmine Wiki Text Colorier plugin'
  author 'sk-ys'
  description 'Add buttons to jsToolBar for changing text and background colors.'
  version '0.1.1'
  url 'https://github.com/sk-ys/redmine_wiki_text_colorizer'
  author_url 'https://github.com/sk-ys'
end
