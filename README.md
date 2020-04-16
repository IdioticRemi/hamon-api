# HamonAPI
The image-generating api I made a long time ago... cuz why not!

## How to get it working?
Well... I didn't do a config file at the time so huh here's how:

### Required

Create an application on your Discord developper page
Get yourself a mongodb instance for the project

### Getting it to work

1.1 Copy your Application ID and Secret in the `app.js` file where I wrote "OAuthID" and "OAuthSecret"
1.2 Copy your redirect URI in that same file just under your credentials

2. Copy your mongodb connection string to the `app.js` file 
(there is a "connection string" near the start of the file, just replace it)

3. Get yourself an SSL certificate and change the key and certificate files in the "ssl" folder

You *should* be good to go... I mean... I hope so!
