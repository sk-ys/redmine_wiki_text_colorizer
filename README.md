# Redmine wiki text colorizer

This is the plugin for Redmine.  
This plugin adds two buttons to jsToolBar to output HTML tags for changing the 
text color and background color. 
![Alt text](doc/images/buttons.png)

## Installation
### When using git
1. Clone this repository to your Redmine plugins directory.
    ```
    git clone https://github.com/sk-ys/redmine_wiki_text_colorizer.git YOUR_REDMINE_DIRECTORY/plugins/redmine_wiki_text_colorizer
    ```
2. Restart Redmine.

### When not using git
1. Download zip file from the [release page](https://github.com/sk-ys/redmine_wiki_text_colorizer/releases) or the [latest main repository](https://github.com/sk-ys/redmine_wiki_text_colorizer/archive/refs/heads/main.zip). 
2. Extract the ZIP file to your Redmine plugin directory. The name of the unzipped directory must be `redmine_wiki_text_colorizer`.
3. Restart Redmine.


## Usage
1. Select the text you want to format.  
![](doc/images/selected_text.png)

2. Open the color palette and select a color. This will insert an HTML tag.  
![](doc/images/text_color_palette_open.png)

### Images
1. Sample text before formatting  
![](doc/images/sample_text_before_formatting.png)

2. Sample text after formatting  
![](doc/images/sample_text_after_formatting.png)  
 ( Background color has been applied as well as text color. )

3. Preview of sample text after formatting  
![](doc/images/sample_text_preview.png)


## ⚠️Caution
If you are using `Textile` or `Markdown` text formatting in Redmine, you will
need to manually update the Redmine source code to support html `SPAN` tag in 
the wiki.  
`CommonMark Markdown` does not require updating the Redmine source code.

## Libraries in use
### Spectrum v2.0.10
This plugin utilizes the Spectrum library (https://github.com/seballot/spectrum)
for color picker functionality. Thanks.
