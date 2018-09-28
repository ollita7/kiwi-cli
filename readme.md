
# <img src="kiwi.png" width="120" alt="logo">
Tool to help creation of components

# Table of Contents
* [Installation](#installation)
* [Commands](#commands)
  
## Installation
1. Install module gobaly
    
    ` npm install kiwi-server-cli -g `

## Commands
1. Init
    It creates a default server to start. Also it creates a tsconfig by default.
    
    ` kc -i`

2. Create controller
    
    ` kc -c [<name> | <path/name>]`

3. Create Middlewares
    
    ` kc -m [ after | before ] [<name> | <path/name>]`

4. Build 
    This command use the tsconfig created by default using init command

    ` kc -b `
    
