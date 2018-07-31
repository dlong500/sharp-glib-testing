# sharp-glib-testing
## Demonstrating glib issues while using sharp

### Running the app in production mode
#### yarn run build-app
#### yarn run imager [command]

### Running the app in development mode
#### yarn start [command]

### command can be either `downsize` or `deepzoom`
#### If `downsize`, the app will attempt to downsize all images in testdata/input/downsize to a max of 4000 pixels (width or height)
#### If `deepzoom`, the app will attempt to generate deepzoom data for all images in testdata/input/deepzoom


### Test Data
#### Test imagery is included in the repo, located in the testdata/input folder

### Problem highlights
#### Glib warning
The image located in testdata/input/downsize will consistently produce a Glib warning message if `sharp.cache(false)` is set.  The warning message is:
```
(sharp:16344): GLib-GObject-WARNING **: invalid uninstantiatable type '(NULL)' in cast to 'GObject'
```
This warning message appears to be non-fatal and the image downsize operation does appear to succeed.

#### Glib concurrency issue
When generating zoom data for a group of images concurrently (using Promise.all), the operation will fail to start intermittently and output messages like:
```
(sharp:21436): GLib-GObject-WARNING **: cannot register existing type 'GsfOutfileStdio'

(sharp:21436): GLib-GObject-WARNING **: cannot retrieve class for invalid (unclassed) type '<invalid>'
```
These "warning" messages ARE fatal, and the node app terminates without continuing.  There are generally a couple of intermediate folders left in the output folder from when the zoom data generation tried to start.