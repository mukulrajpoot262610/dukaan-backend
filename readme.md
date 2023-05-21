# Apni Dukaan

Dukaan is an ecommerce platform that lets you build, manage, and scale your store in seconds—no coding or design skills required.

With Dukaan, you get all the tools you need to build your online store fast, so you can start selling to customers.

Choose your store name, upload your inventory, and auto-generate product descriptions to get your store up and running.

Then you can connect to a third-party payment gateway to accept online orders from all around the globe—without any additional transaction fees!

---

## Requirements

For development, you will only need Node.js and npm, installed in your environment.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

---

## Install

    $ git clone hhttps://github.com/mukulrajpoot262610/dukaan-backend
    $ cd dukaan-backend
    $ npm install

## Configure app

Requirement - MongoDB Atlas URL

    $ npm run prepare

## Running the project

    $ npm run dev

## Simple build for production

    $ npm run build
