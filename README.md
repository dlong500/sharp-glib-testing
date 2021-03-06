# sharp-glib-testing
## Demonstrating glib issues while using sharp

### Running the app in production mode
#### yarn run build-app
#### yarn run imager [command]

### Running the app in development mode
#### yarn start [command]

### command can be either `downsize` or `deepzoom`
#### If `downsize`, the app will attempt to downsize all images in testdata/input/downsize to a max of 4000 pixels (width or height)
#### If `deepzoom`, the app will attempt to generate deepzoom data for all images in testdata/input/deepzoom concurrently (tasks started wrapped in a `Promise.all`)


### Test Data
#### Test imagery is included in the repo, located in the testdata/input folder

## Problem highlights
### Glib warning when downsizing certain images
#### <span style="color:red">STATUS: Still investigating (The precompiled binaries used by sharp as of 8/1/2018 exhibit this issue, but it seems that some self-compiled versions are not affected.  More testing is needed to narrow down specific package versions)</span>

#### Below are specifics of the original reported issue:
The image located in testdata/input/downsize will consistently produce a Glib warning message if `sharp.cache(false)` is set.  The warning message is:
```
(sharp:19445): GLib-GObject-WARNING **: 00:12:28.592: invalid uninstantiatable type '(null)' in cast to 'GObject'

(sharp:19445): GLib-GObject-CRITICAL **: 00:12:28.592: g_object_set_qdata: assertion 'G_IS_OBJECT (object)' failed
```
This warning message appears to be non-fatal and the image downsize operation does appear to succeed.
<hr />

### Glib/libgsf concurrency issue
#### <span style="color:green">UPDATE (8/1/2018): The race condition has been traced to a compiler optimization bug that affects at least gcc 5.4.0, but appears not to affect version 7.3+.  Some testing may still need to be done with various compilers and versions.</span>
#### See https://github.com/lovell/sharp/issues/1151 for more details.

#### Below are specifics of the original reported issue:
When generating deepzoom data for a group of images concurrently (using Promise.all), the operation will fail to start intermittently and output messages like:
```
(sharp:32416): GLib-GObject-WARNING **: 00:14:57.091: cannot register existing type 'GsfOutfileStdio'

(sharp:32416): GLib-GObject-WARNING **: 00:14:57.091: invalid class cast from 'GsfOutfileStdio' to 'GsfOutfile'

(sharp:32416): GLib-GObject-CRITICAL **: 00:14:57.091: g_object_new_valist: assertion 'G_TYPE_IS_OBJECT (object_type)' failed

(sharp:32416): GLib-GObject-WARNING **: 00:14:57.091: invalid cast from 'GsfOutfileStdio' to 'GsfOutfile'
Segmentation fault (core dumped)
```
These "warning" messages ARE fatal, and the node app terminates without continuing.  There are generally a couple of intermediate folders left in the output folder from when the zoom data generation tried to start.  As noted above, this only happens intermittently.  Sometimes the deepzoom data generation works fine, and when it does fail it always seems to be at the beginning (when the concurrent operations attempt to start).  The concurrency issue can occur regardless of whether `sharp.cache(false)` is set or not.
