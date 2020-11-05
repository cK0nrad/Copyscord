[![Maintainability](https://api.codeclimate.com/v1/badges/992f7e984f1c04cc6bf8/maintainability)](https://codeclimate.com/github/cK0nrad/Copyscord/maintainability)
# Copyscord

It's just a simple Discord clone with a REST API, socket event and voice connection

It's my first time with ReactJS so it's not really optimized but it do work :smile:

### Require

SocketIO

MongoDB

Redis

### Before using:

1. Run prestart script for SSL cert
    > $: npm run prestart
2. Change config for client and server
3. Add your voice server into the "voiceNode" collection (see copyscord-doc/Database scheme)
4. Build the project 
    > $: tsc && node build/index.js
