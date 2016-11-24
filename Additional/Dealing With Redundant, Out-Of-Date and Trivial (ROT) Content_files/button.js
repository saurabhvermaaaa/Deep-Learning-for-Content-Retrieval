(function () {

    'use strict';

    /*-----------------------------*
    /  Config / Constants         /
    /___________________________*/

    var defaults = { 
        bookProviderId: 'GoogleBooks',
        buttonHostUrl: 'https://degreed.com/',
        errorPrefix: 'Couldn\'t load the Degreed Button: ',
        externalId: location.href,
        idPrefix: 'degreed-button',
        idPrefixScript: 'degreed-button-js',
        popupWidth: 274, // Must match constants.js BASE_WIDTH
        popupHeight: 415,
        type: 'Article',
        style: '28-full'
    };



    // Below is a gulp-include, not a normal comment
    //
    // START INCLUDE
    var getExternalId,
        getImageUrl,
        getInputType,
        getLength,
        getLengthSvc,
        getProvider,
        getSource,
        getSummary,
        getTags,
        getTitle;
    
    getExternalId = function(url) {
        var providerName, slug, handleYouTube, handleVimeo;
    
        if (!url) {
            url = document.location.href;
        }
    
        providerName = getProvider();
    
        handleYouTube = function() {
            slug = url.match(/[?&]v=([^&#]+)/)[1];
            if (slug) {
                return slug;
            }
            return undefined;
        };
    
        handleVimeo = function() {
            slug = url.substr(url.lastIndexOf('/') + 1);
            if (slug && slug.length) {
                return slug;
            }
            return undefined;
        };
    
        switch (providerName) {
            case 'YouTube':
            return handleYouTube();
            case 'Vimeo':
            return handleVimeo();
            default:
            return undefined;
        }
    };
    
    getImageUrl = function() {
        var metaSelector, metaImages;
        metaSelector = 'meta[itemprop="thumbnailUrl"],meta[itemprop="image"],meta[property="og:image"],meta[name="twitter:image"]';
        metaImages = document.querySelectorAll(metaSelector);
        for (var i = 0; i < metaImages.length; i++) {
            if (metaImages[i].content.length && metaImages[i].content.length > 0) {
                return metaImages[i].content;
            }
        }
        return undefined;
    };
    
    getInputType = function(url) {
        if (!url) {
            url = document.location.href;
        }
        if (url.indexOf('youtube.') !== -1 ||
        url.indexOf('vimeo.') !== -1 || url.indexOf('www.ted.com') !== -1 || url.indexOf('tedxtalks.ted.com/video') !== -1 || url.indexOf('channel9.msdn.com') !== -1) {
            return 'Video';
        }    
        return 'Article';
    };
    
    getLength = function () {
        var url = document.location.href,
        isYouTube = url.indexOf('youtube.') !== -1,
        isVimeo = url.indexOf('vimeo.') !== -1,
        handleYouTube;
    
        handleYouTube = function () {
            var duration = document.querySelector('meta[itemprop="duration"]'),
            totalSeconds;
            if (duration) {
                if (duration.content) {
                    var time = duration.content.split('M');
                    var minsAsSeconds = time[0].replace(/\D+/g, '') * 60;
                    totalSeconds = (time[1].replace(/\D+/g, '') * 1) + minsAsSeconds;
                }
            }
            return totalSeconds;
        };
    
        if (isYouTube) {
            return handleYouTube();
        }
    
        return null;
    };
    
    getLengthSvc = function() {
        var providerName, slug, handleYouTube, handleVimeo;
    
        providerName = getProvider();
    
        handleYouTube = function() {
            slug = document.location.href.match(/[?&]v=([^&#]+)/)[1];
            if (slug && slug.length) {
                return '//gdata.youtube.com/feeds/api/videos/' + slug + '?alt=json';
            }
            return undefined;
        };
    
        handleVimeo = function() {
            slug = document.location.pathname.substr(1);
            if (slug && slug.length) {
                return '//vimeo.com/api/v2/video/' + slug + '.json';
            }
            return undefined;
        };
    
        switch (providerName) {
            case 'YouTube':
            return handleYouTube();
            case 'Vimeo':
            return handleVimeo();
            default:
            return undefined;
        }
    };
    
    getProvider = function(url) {
        if (!url) {
            url = document.location.href.toLowerCase();
        }
        // not just .com so we don't exclude other country TLD's
        if (url.indexOf('youtube.') !== -1) {
            return 'YouTube';
        } else if (url.indexOf('vimeo.') !== -1) {
            return 'Vimeo';
        } else {
            return undefined;
        }
    };
    
    getSource = function() {
        return document.location.hostname;
    };
    
    getSummary = function() {
        var metaSelector, metaDescs;
        // YouTube's SPA doesn't update the <head> meta tags on some navigation, so we need to first try
        // using the meta[itemprop] which DOES get updated
        metaSelector = 'meta[itemprop="description"],meta[name="description"],meta[property="description"],meta[property="og:description"]';
        metaDescs = document.querySelectorAll(metaSelector);
        for (var i = 0; i < metaDescs.length; i++) {
            if (metaDescs[i].content) {
                if (metaDescs[i].content.length && metaDescs[i].content.length > 0) {
                    return metaDescs[i].content;
                }
            }
        }
        return undefined;
    };
    
    getTags = function() {
        var providerName, slug, suggestedYtTags, suggestedVimeoTags;
    
        providerName = getProvider();
    
        suggestedYtTags = function() {
            try {
                var ytTags = ytplayer.config.args.keywords.split(',');
                var tags = [];
                for (var i = 0; i < ytTags.length; i++) {
                    tags.push({ Name: ytTags[i] });
                }
                return tags;
            } catch (e) {
                return [];
            }
        };
    
        suggestedVimeoTags = function() {
            try {
                var tags = [];
                var tagLi = document.querySelectorAll('.tags li');
                for (var i = 0; i < tagLi.length; i++) {
                    tags.push({ Name: tagsLi[i].innerText });
                }
                return tags;
            } catch (e) {
                return [];
            }
        };
    
        switch (providerName) {
            case 'YouTube':
            return suggestedYtTags();
            case 'Vimeo':
            return suggestedVimeoTags();
            default:
            return undefined;
        }
    };
    
    getTitle = function() {
        var title, titleTag;
        titleTag = document.getElementsByTagName('title')[0];
        if (titleTag) {
            title = titleTag.innerHTML;
        }
        if (title !== '') {
            return title;
        }
        if (document.title && document.title !== '') {
            return document.title;
        }
        if (document.location.href.indexOf('/') > -1) {
            return document.location.href
            .substr(document.location.pathname.lastIndexOf('/') + 1);
        }
        return document.location.hostname;
    };
    

    //
    // END INCLUDE



    /*-----------------------------*
    /  Param Parser               /
    /___________________________*/

    var paramParser = (function () {        
        var parseAndExtract = function (el, getStyle) {
            var prefix = 'data-';
            var stylePrefix = prefix + 'style';
            var extractedOptions = [].filter.call(el.attributes, function(at) { return /^data-/.test(at.name); });
            var options = {};
            var foundStyle = false;
            for (var i = 0; i < extractedOptions.length; i++) {
                var ex = extractedOptions[i];                
                if (ex.name === stylePrefix) {
                    foundStyle = true;
                    if (!getStyle) {
                        // Skip the style attribute
                        continue;
                    } else {
                        return ex.value;
                    }
                }
                                 // dash to camelCase
                var optionName = ex.name.substr(prefix.length).replace(/-([a-z])/gi, function ( $0, $1 ) { return $1.toUpperCase(); } );
                options[optionName] = ex.value;
            }
            if (getStyle) {
                // Provide default since not provided in attributes
                return defaults.style;
            }
            return options;
        };
        
        var serialize = function(obj) {
            var str = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p) && typeof obj[p] !== 'function') {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
            }
            return str.join('&');
        };
        
        return {
            parseAndExtract: parseAndExtract,
            serialize: serialize
        };
    })();



    /*-----------------------------*
    /  Input Classes              /
    /___________________________*/

    function BaseInputClass(options) {
        this.type = options.type;
        this.externalId = options.externalId || defaults.externalId;
        this.title = options.title || getTitle();
        this.description = options.description || getSummary();
        this.image = options.image || getImageUrl();
        this.tags = options.tags || getTags();
        this.length = options.length || getLength();
    }

    function ArticleClass(options) {
        BaseInputClass.call(this, options);
        this.providerId = options.providerId || getProvider();
    }

    function BookClass(options) {
        // Doesn't inherit from BaseInputClass
        
        this.type = options.type;
        this.isbn = options.isbn || null; // Required
        this.providerId = options.providerId || defaults.bookProviderId;
        this.tags = options.tags || getTags();

        this.validate = function () {
            var response = { 
                isValid: true,
                msg: ''
            };
            if (this.isbn === null) {
                response.isValid = false;
                response.msg = 'A book must have the `isbn` param provided';
            }
            return response;
        };
    }

    function CourseClass(options) {
        BaseInputClass.call(this, options);

        this.institutionId = options.institutionId || null; // Required
        this.institution = options.institution || null;
        this.lengthUnit = options.lengthUnit || null;
        this.cost = options.cost || null;
        this.costUnit = options.costUnit || null;
        this.difficulty = options.difficulty || null;
        this.language = options.language || null;
        this.startDate = options.startDate || null;
        this.endDate = options.endDate || null;
        this.instructors = options.instructors || null;
        this.videoUrl = options.videoUrl || null;

        this.validate = function () {
            var response = { 
                isValid: true,
                msg: ''
            };
            if (this.institutionId === null) {
                response.isValid = false;
                response.msg = 'A course must have the `institutionId` param provided';
            }
            return response;
        };
    }

    function VideoClass(options) {
        BaseInputClass.call(this, options);
        this.providerId = getProvider();
        this.source = getSource();
    }

    function InputFactory(options) {
        if (!options || !options.type) {
            options.type = 'Article';
        }

        // Normalize case
        options.type = options.type.charAt(0).toUpperCase() + options.type.slice(1).toLowerCase();

        switch (options.type) {
            default:
            case 'Article':
                return new ArticleClass(options);
            case 'Book':
                return new BookClass(options);
            case 'Course':
                return new CourseClass(options);
            case 'Video':
                return new VideoClass(options);
        }
    }



    /*-----------------------------*
    /  UI Helpers                 /
    /___________________________*/

    function getPopupPosition(w, h) {
        // Fixes dual-screen position                         Most browsers      Firefox
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = width - w + dualScreenLeft; // pin to right
        var top = (height / 2 - h) + dualScreenTop + 10; // pin to (almost) top

        return {
            left: left,
            top: top
        };
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    

    /*-----------------------------*
    /  Init                       /
    /___________________________*/

    function init() {
        var degreedButtonJs,
            options,
            buttonStyle,
            currentInput,
            buttonParams,
            inputValidation,
            buttonCss = '',
            popupWidth = defaults.popupWidth,
            popupHeight = defaults.popupHeight,
            popupPosition = getPopupPosition(popupWidth, popupHeight),
            stylesInserted,
            dgCss,
            dgJsAll,
            dgJsNew,
            existingStyle;
        
        // Define the Degreed button stylesheet
        dgCss              = document.createElement('link');
        dgCss.rel          = 'stylesheet';
        dgCss.className    = 'dg-styles';

        // Only add stylesheet once
        existingStyle = document.getElementById(dgCss.id);
        if (existingStyle) {
            stylesInserted = true;
        }

        // Collect our buttons from the DOM
        dgJsAll = document.getElementsByClassName('degreed-button');
        dgJsNew = [];

        // Find the ones not bound yet
        for (var i = 0; i < dgJsAll.length; i++) {
            var thisScript = dgJsAll[i];
            if (thisScript.getAttribute('data-bound') === null) {
                dgJsNew.push(thisScript);
                thisScript.setAttribute('data-bound', true);
            }
        }

        // For each Degreed JS we collect
        for (var i = 0; i < dgJsNew.length; i++) {
            var anchor, span;
            var thisScript = dgJsNew[i];
            var buttonHost = thisScript.getAttribute('data-host');
            var utmCampaign = thisScript.getAttribute('data-campaign');
            buttonStyle = paramParser.parseAndExtract(thisScript, true);
            options = paramParser.parseAndExtract(thisScript);
            currentInput = new InputFactory(options);
            buttonParams = paramParser.serialize(currentInput);

            if (buttonHost) {
                defaults.buttonHostUrl = buttonHost;
            }

            if (utmCampaign) {
                buttonParams = 'utm_campaign=' + utmCampaign + '&' + buttonParams;
            }

            // If invalid, exit early
            if (typeof currentInput.validate === 'function') {
                inputValidation = currentInput.validate();
                if (inputValidation.isValid === false) {
                    if (console && console.log) {
                        console.log(defaults.errorPrefix + inputValidation.msg);
                    }
                    return;
                }
            }

            dgCss.href  = defaults.buttonHostUrl + 'scripts/degreed/media/button/button.min.css';

            // Insert Styles
            if (!stylesInserted) {
                insertAfter(dgCss, thisScript);
                stylesInserted = true;
            }

            anchor = document.createElement('a');
            anchor.setAttribute('href', defaults.buttonHostUrl + 'degreed-button/?' + buttonParams);
            anchor.onclick = function () {
                window.open(this.href,'','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,' +
                                'top=' + popupPosition.top + ',' +
                                'left=' + popupPosition.left + ',' +
                                'width=' + popupWidth + ',' +
                                'height=' + popupHeight);
                return false;
            };
            anchor.className = 'degreed-button degreed-' + buttonStyle;
            anchor.setAttribute('aria-label', 'Add to Degreed');
            anchor.setAttribute('title', 'Add to Degreed');
            anchor.innerHTML = ' <span>Add to Degreed</span>';

            // Insert Button
            insertAfter(anchor, thisScript);
        }

        return;
    }

    return init();

})();

