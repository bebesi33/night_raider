var load = {};

/* Image kezelés */
load.image = function(src) {
    var img = document.createElement('img');
    img.src = src;
    return img;
};

/* Képek betöltése */
load.load = function(images, onLoad, onProgress) {
    var loaded = 0;

    function checkLoaded() {
        if (onProgress) {
            onProgress(loaded / images.length * 100);
        }
        if (loaded === images.length) {
            onLoad();
        }
    }

    for (var i = 0; i < images.length; i++) {
        if (images[i].width > 0) { 
            loaded++;
        } else { 
            images[i].addEventListener('load', function() {
                loaded++;
                checkLoaded();
            });
        }
    }
    checkLoaded();
};

// hangok betöltése és hang kezelés