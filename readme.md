
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
    By default this command creates a folder environments with two environments: 1) environment.ts and 2) environment.prod.ts. Also you can create as many environments as you want.
    
    ` kc init`

2. Create controller
    
    ` kc controller [<name> | <path/name>]`

3. Create Middlewares
    
    ` kc middleware [ after | before ] [<name> | <path/name>]`

4. Build 
    This command use the tsconfig created by default using init command.
    The <env> specify what environment file in the environments folder is goint to be compiled.
    Also the code will be generated on a folder dist/<env>.

    ` kc build -e <env>`

    
