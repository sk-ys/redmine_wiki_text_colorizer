class WikiTextColorizer::Hooks < Redmine::Hook::ViewListener
  render_on :view_layouts_base_html_head, :partial => "wiki_text_colorizer/base"
end