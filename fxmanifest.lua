fx_version 'adamant'
game 'gta5'

author "gush3l"
description "Beautiful modern UI scoreboard with user previews, player sorting and more!"
version '1.2.2'
ui_page "html/main.html"

lua54 'yes'

shared_scripts {
    "@vrp/lib/utils.lua",
    'config.lua'
}

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}

files {
    'html/main.html',
    'html/js/*.js',
    'html/css/*.css',
    'html/css/*.ttf',
    'html/js/sounds/*.ogg'
}

escrow_ignore {
  '*.lua'
}
