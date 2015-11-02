var saf = {
    init: function() {
        var obj = saf;
        obj.title = $('.choose-title');
        obj.prefix = $('.choose-prefix');
        obj.select = $('.item-select');
        obj.selectedProducts = [];
        obj.selectedProductIds = [];
        obj.lastProduct = null;
        obj.lastTypeId = null;
        obj.lastPage = 'application';
        obj.retrieveRanges();

        // Top buttons
        $('body').on('click', '#btn-startover', function() {
            obj.prefix.html('Choose');
            obj.title.html('Product Range');
            obj.selectedProducts = [];
            obj.selectedProductIds = [];
            obj.lastProduct = null;
            obj.lastPage = 'application';
            obj.retrieveRanges();
        });
        $('body').on('click', '#btn-save', function() {
           $('.form-info').submit();
        });
        $('body').on('click', '#btn-noneskip', function() {
            var typeId = obj.select.attr('data-type-id');
            obj.removeProduct(typeId);
            obj.showApplication(obj.application);
        });
        $('body').on('click', '#btn-close', function() {
            console.log(obj.lastPage);
            if (obj.lastPage == 'application') {
                obj.showApplication(obj.application);
            } else if (obj.lastPage == 'productSelect') {
                obj.retrieveProducts(obj.lastTypeId)
            } else if (obj.lastPage == 'product') {
                obj.showProduct(obj.lastProduct);
            }
        });
        $('body').on('click', '#btn-review', function() {
            obj.showReview(obj.application);
        });

        // Close Media
        $('body').on('click', '.media-background', function() {
            $(this).remove();
            $('.media-item').remove();
        });

        // Add an option to a Product
        $('body').on('click', '.product-option-add-option-btn, #btn-addoption', function() {
            $('#btn-addoption').hide();
            var optionId = $(this).attr('data-option-id');
            var productId = $(this).attr('data-product-id');
            obj.chooseOption(productId, optionId);
        });

        // Option & Feature Info
        $('body').on('click', '.product-option-info-btn', function() {
            var optionType = $(this).attr('data-option-type');
            var optionId = $(this).attr('data-option-id');

            if (optionType == 'feature') {
                obj.retrieveFeature(optionId);
            } else {
                obj.retrieveOption(optionId);
            }
        });

        // Open Media
        $('body').on('click', '.option-media-item', function() {
            var mediaId = $(this).attr('data-media-id');
            obj.retrieveMedia(mediaId);

        });

        // Product Select buttons
        $('body').on('click', '.product-select', function() {
            var productId   = $(this).parents('.product').attr('data-product-id');
            var typeId      = $(this).parents('.product').attr('data-type-id');
            obj.chooseProduct(productId, typeId);
        });

        // Product Info "modals"
        $('body').on('click', '.selected-product-options', function() {
            var productId   = $(this).parents('.selected-product').attr('data-product-id');
            obj.retrieveProduct(productId, 'application');
        });

        $('body').on('click', '.product-options', function() {
            var productId   = $(this).parents('.product').attr('data-product-id');

            obj.lastTypeId = $(this).parents('.product').attr('data-type-id');
            obj.lastPage = 'productSelect';
            obj.retrieveProduct(productId);
        });

        // Select a Range
        $('body').on('click', '.range', function() {
            obj.range = {
                'id': $(this).attr('data-id'),
                'name': $(this).attr('data-name')
            };
            obj.title.html(obj.range.name + ' Application');
            obj.retrieveApplications(obj.range.id);
        });

        // Select an Application
        $('body').on('click', '.application', function() {
            obj.application = {
                'id': $(this).attr('data-id'),
                'name': $(this).attr('data-name')
            };
            obj.retrieveApplication(obj.application.id);
        });

        // Product Selects
        $('body').on('click', '.landing a.option-link', function() {
            obj.retrieveProducts(1);
        });
        $('body').on('click', '.primary a.option-link', function() {
            obj.retrieveProducts(2);
        });
        $('body').on('click', '.secondary a.option-link', function() {
            obj.retrieveProducts(3);
        });
        $('body').on('click', '.selected-product-change', function() {
            var typeId = $(this).parents('.selected-product').attr('data-type-id');
            obj.retrieveProducts(typeId);
        });
    },
    retrieveMedia: function(id) {
        var obj = this;
        $.get('/api/media/' + id, function(data) {
            obj.showMedia(data);
        });
    },
    retrieveProducts: function(id) {
        $('#btn-review, #btn-startover').hide();
        $('#btn-noneskip, #btn-close').show();

        var obj = this;
        $.get('/api/products/' + obj.application.id + '/' + id, function(data) {
           obj.initProducts(data);
        });
    },
    retrieveRanges: function() {
        var obj = this;
        $.get('/api/range', function(data) {
            obj.initRanges(data);
        });
    },
    retrieveApplications: function(id) {
        var obj = this;
        $.get('/api/application/range/' + id, function(data) {
            obj.initApplications(data);
        });
    },
    retrieveApplication: function(id) {
        var obj = this;
        $.get('/api/application/application/' + id, function(data) {
            obj.application = data;
            obj.showApplication(data);
        });
    },
    retrieveProduct: function(id, lastPage) {

        var obj = this;

        if (lastPage == undefined || !lastPage.length) {
            obj.lastPage = 'productSelect'
        } else {
            obj.lastPage = lastPage;
        }

        $.get('/api/product/' + id, function(data) {
            obj.lastProduct = data;
            obj.showProduct(obj.lastProduct);
        });
    },
    retrieveOption: function(id) {
        var obj = this;
        $.get('/api/option/' + id, function(data) {
            obj.showOption(data);
        });
    },
    retrieveFeature: function(id) {
        var obj = this;
        $.get('/api/feature/' + id, function(data) {
            obj.showFeature(data);
        });
    },
    addOverlays: function() {
        var obj = this;
        var applicationId = obj.application.id;
        var productIds = '';
        for (i in obj.selectedProducts) {
            var selectedProduct = obj.selectedProducts[i].product.product;
            productIds += selectedProduct.id + '|';
        }
        if (!productIds.length) {
            return false;
        }
        $.get('/api/overlays/' + productIds + '/' + applicationId, function(overlays) {
            for (i in overlays) {
                var overlay = overlays[i];
                console.log(overlay);
                var overlayImage = $('<img class="overlay-image" />').attr('src', overlay);
                $('.main-image-div').append(overlayImage);
            }
        });
    },

    showMedia: function(mediaData) {
        var obj = this;
        var media = '';
        if (mediaData.media_type == 'video') {
            console.log(mediaData);
            media = $('<iframe width="560" height="315" frameborder="0" allowfullscreen class="media-item"></iframe>').attr('src', mediaData.video_url);
        } else {
            media = $('<img class="media-item" />').attr('src', mediaData.image);
        }
        background = $('<div class="media-background"></div>');
        $('body').append(background);
        $('body').append(media);
        // Center the Media
        media.css('margin-top', '-' + media.height() / 2 + 'px').css('margin-left', '-' + media.width() / 2 + 'px')

    },
    showProduct: function(productData) {
        var obj = this;
        var product = productData.product;
        var options = productData.options;
        var features = productData.features;
        var brand = productData.brand;

        obj.lastPage = 'application';

        $('#btn-noneskip, #btn-review, #btn-startover, #btn-addoption').hide();
        $('#btn-close').show();

        obj.prefix.html('Info & Options');
        obj.title.html(product.name);
        obj.select.html('');

        var productText = '';
        if (product.preview_description.length) { productText += '<strong>' + product.preview_description + '</strong><br /><br />'; }
        if (product.preview_capacity_info_1.length) { productText += product.preview_capacity_info_1 + '<br />'; }
        if (product.preview_capacity_info_2.length) { productText += product.preview_capacity_info_2 + '<br />'; }
        if (product.extended_capacity_info_1.length) { productText += product.extended_capacity_info_1 + '<br />'; }
        if (product.extended_capacity_info_2.length) { productText += product.extended_capacity_info_2 + '<br />'; }


        productInfo = {
            'topDiv': $('<div class="product-top-div"></div>'),
            'bottomDiv': $('<div class="product-bottom-div"></div>'),
            'topLeftDiv': $('<div class="product-info-div"></div>'),
            'topRightDiv': $('<div class="product-info-div"></div>'),
            'bottomLeftDiv': $('<div class="product-info-div"></div>'),
            'bottomRightDiv': $('<div class="product-info-div"></div>'),
            'image': $('<img class="product-info-image" />').attr('src', product.image),
            'title': $('<div class="product-info-title"></div>').html(product.name),
            'text': $('<div class="product-info-text"></div>').html(productText),
            'featureTitle': $('<div class="product-section-title"></div>').html('Key Features'),
            'optionTitle': $('<div class="product-section-title"></div>').html('Options'),
            'features': $('<div class="product-info-features"></div>'),
            'options': $('<div class="product-info-options"></div>'),
            'clear': $('<div class="clear"><br /><br /></div>'),
            'brandImage': $('<img class="product-brand-image" />').attr('src', brand.image)
        };
        productInfo.topLeftDiv.append(productInfo.image);
        productInfo.topRightDiv.append(productInfo.brandImage);
        productInfo.topRightDiv.append(productInfo.title);
        productInfo.topRightDiv.append(productInfo.text);
        productInfo.topDiv.append(productInfo.topLeftDiv);
        productInfo.topDiv.append(productInfo.topRightDiv);
        productInfo.bottomLeftDiv.append(productInfo.featureTitle);
        productInfo.bottomLeftDiv.append(productInfo.features);
        for (i in features) {
            var feature = features[i];
            var featureInfo = {
                'div': $('<div class="product-option-div"></div>'),
                'img': $('<img class="product-option-image" />').attr('src', feature.image),
                'title': $('<div class="product-option-title"></div>').html(feature.name),
                'buttons': $('<div class="product-option-buttons"></div>'),
                'infoButton': $('<img class="product-option-info-btn" />').attr('src', '/img/button_learnmore.png').attr('data-option-id', feature.id).attr('data-option-type', 'feature'),
            }
            featureInfo.div.append(featureInfo.img);
            featureInfo.div.append(featureInfo.title);
            featureInfo.buttons.append(featureInfo.infoButton);
            featureInfo.div.append(featureInfo.buttons);
            productInfo.bottomLeftDiv.append(featureInfo.div);
        }

        productInfo.bottomRightDiv.append(productInfo.optionTitle);
        productInfo.bottomRightDiv.append(productInfo.options);
        for (i in options) {
            var option = options[i];
            var optionInfo = {
                'div': $('<div class="product-option-div"></div>'),
                'img': $('<img class="product-option-image" />').attr('src', option.image),
                'title': $('<div class="product-option-title"></div>').html(option.name),
                'buttons': $('<div class="product-option-buttons"></div>'),
                'infoButton': $('<img class="product-option-info-btn" />').attr('src', '/img/button_learnmore.png').attr('data-option-id', option.id).attr('data-option-type', 'option'),
                'addOptionButton': $('<img class="product-option-add-option-btn" />').attr('src', '/img/button_addoption_amber.png').attr('data-option-id', option.id).attr('data-product-id', product.id)
            }
            optionInfo.div.append(optionInfo.img);
            optionInfo.div.append(optionInfo.title);
            optionInfo.buttons.append(optionInfo.infoButton);
            if (obj.selectedProductIds.indexOf(product.id.toString()) > -1)
                optionInfo.buttons.append(optionInfo.addOptionButton);
            optionInfo.div.append(optionInfo.buttons);
            productInfo.bottomRightDiv.append(optionInfo.div);
        }

        productInfo.bottomDiv.append(productInfo.bottomLeftDiv);
        productInfo.bottomDiv.append(productInfo.bottomRightDiv);

        obj.select.append(productInfo.topDiv);
        obj.select.append(productInfo.clear);
        obj.select.append(productInfo.bottomDiv);
        obj.select.append($('<div class="cf"></div>'));


    },
    showOption: function(option) {
        var obj = this;
        var media = option.media;

        $('#btn-addoption').attr('data-option-id', option.id).attr('data-product-id', obj.lastProduct.product.id);

        obj.lastPage = 'product';
        obj.prefix.html('Option');
        obj.title.html(option.name);
        obj.select.html('');

        var optionInfo = {
            'div': $('<div class="option-info-div"></div>'),
            'img': $('<img class="option-info-image" />').attr('src', option.image),
            'advantageTitle': $('<div class="option-info-title"></div>').html('Advantage'),
            'advantageText': $('<div class="option-info-text"></div>').html(option.advantage),
            'benefitTitle': $('<div class="option-info-title"></div>').html('Benefit'),
            'benefitText': $('<div class="option-info-text"></div>').html(option.benefit),
            'mediaTitle': $('<div class="option-info-media-title"></div>').html('Media'),
            'cf': $('<div class="cf"></div>')
        };

        optionInfo.div.append(optionInfo.img);
        optionInfo.div.append(optionInfo.advantageTitle);
        optionInfo.div.append(optionInfo.advantageText);
        optionInfo.div.append(optionInfo.benefitTitle);
        optionInfo.div.append(optionInfo.benefitText);
        optionInfo.div.append(optionInfo.cf);
        optionInfo.div.append(optionInfo.mediaTitle);

        for (i in media) {
            var mediaItem = media[i];
            var mediaInfo = {
                'div': $('<div class="option-media-item"></div>').attr('data-media-id', mediaItem.id),
                'img': $('<img class="option-media-image" />').attr('src', mediaItem.thumbnail),
                'title': $('<div class="option-media-title"></div>').html(mediaItem.name),
                'text': $('<div class="option-media-text"></div>').html(mediaItem.description)
            };
            mediaInfo.div.append(mediaInfo.img);
            mediaInfo.div.append(mediaInfo.title);
            mediaInfo.div.append(mediaInfo.text);
            optionInfo.div.append(mediaInfo.div);
        }

        optionInfo.div.append($('<div class="cf"></div>'));
        obj.select.append(optionInfo.div);
        if (obj.selectedProductIds.indexOf(obj.lastProduct.product.id.toString()) > -1)
            $('#btn-addoption').show();
    },
    showFeature: function(feature) {
        var obj = this;
        var media = feature.media;

        obj.lastPage = 'product';
        obj.prefix.html('Key Feature');
        obj.title.html(feature.name);
        obj.select.html('');

        var optionInfo = {
            'div': $('<div class="option-info-div"></div>'),
            'img': $('<img class="option-info-image" />').attr('src', feature.image),
            'advantageTitle': $('<div class="option-info-title"></div>').html('Advantage'),
            'advantageText': $('<div class="option-info-text"></div>').html(feature.advantage),
            'benefitTitle': $('<div class="option-info-title"></div>').html('Benefit'),
            'benefitText': $('<div class="option-info-text"></div>').html(feature.benefit),
            'mediaTitle': $('<div class="option-info-media-title"></div>').html('Media'),
            'cf': $('<div class="cf"></div>')
        };

        optionInfo.div.append(optionInfo.img);
        optionInfo.div.append(optionInfo.advantageTitle);
        optionInfo.div.append(optionInfo.advantageText);
        optionInfo.div.append(optionInfo.benefitTitle);
        optionInfo.div.append(optionInfo.benefitText);
        optionInfo.div.append(optionInfo.cf);
        optionInfo.div.append(optionInfo.mediaTitle);

        for (i in media) {
            var mediaItem = media[i];
            var mediaInfo = {
                'div': $('<div class="option-media-item"></div>').attr('data-media-id', mediaItem.id),
                'img': $('<img class="option-media-image" />').attr('src', mediaItem.thumbnail),
                'title': $('<div class="option-media-title"></div>').html(mediaItem.name),
                'text': $('<div class="option-media-text"></div>').html(mediaItem.description)
            };
            mediaInfo.div.append(mediaInfo.img);
            mediaInfo.div.append(mediaInfo.title);
            mediaInfo.div.append(mediaInfo.text);
            optionInfo.div.append(mediaInfo.div);
        }
        optionInfo.div.append($('<div class="cf"></div>'));
        obj.select.append(optionInfo.div);
    },
    showReview: function(application) {
        var obj = this;
        obj.lastPage = 'application';
        obj.prefix.html('Application');
        obj.title.html(application.name);

        // Make sure the right buttons are showing.
        $('#btn-noneskip, #btn-addoption, #btn-review, #btn-startover').hide();
        $('#btn-close').show();

        // Clear the Item Select div
        obj.select.html('');

        var optionsSelected = $('<img class="options-selected" />').attr('src', '/img/button_optionsselected.png');

        var landing     = {
            'div': $('<div class="landing" data-type-id="1"></div>'),
            'title': $('<div class="option-title">Landing Gear</div>')
        };
        landing.div.append(landing.title);

        var primary     = {
            'div': $('<div class="primary" data-type-id="2"></div>'),
            'title': $('<div class="option-title">Primary Suspension</div>')
        };
        primary.div.append(primary.title);

        var secondary     = {
            'div': $('<div class="secondary" data-type-id="3"></div>'),
            'title': $('<div class="option-title">Secondary Suspension</div>')
        };
        secondary.div.append(secondary.title);

        // Show selected Products
        for (i in obj.selectedProducts) {
            var selectedProduct = obj.selectedProducts[i];
            productInfo = selectedProduct.product.product;
            var productText = '';
            if (productInfo.preview_description.length) { productText += productInfo.preview_description + '<br />'; }
            if (productInfo.preview_capacity_info_1.length) { productText += productInfo.preview_capacity_info_1 + '<br />'; }
            if (productInfo.preview_capacity_info_2.length) { productText += productInfo.preview_capacity_info_2 + '<br />'; }

            var selectedProductInfo = {
                'div': $('<div class="selected-product"></div>').attr('data-type-id', selectedProduct.type).attr('data-product-id', productInfo.id),
                'image': $('<img class="selected-product-image" />').attr('src', productInfo.image),
                'info': $('<div class="selected-product-info"></div>'),
                'title': $('<div class="selected-product-title"></div>').html(productInfo.name),
                'text': $('<div class="selected-product-text"></div>').html(productText),
                'cf': $('<div class="cf"></div>')
            }
            selectedProductInfo.info.append(selectedProductInfo.title);
            selectedProductInfo.info.append(selectedProductInfo.text);
            selectedProductInfo.div.append(selectedProductInfo.image);
            selectedProductInfo.div.append(selectedProductInfo.info);

            if (selectedProduct.options.length > 0) {
                selectedProductInfo.div.append(selectedProductInfo.cf);
                selectedProductInfo.div.append(optionsSelected);
                selectedProductInfo.div.append(selectedProductInfo.cf);
            }

            for (i in selectedProduct.options) {

                var option = selectedProduct.options[i];
                var selectedOptionInfo = {
                    'div': $('<div class="selected-product"></div>'),
                    'image': $('<img class="selected-product-image" />').attr('src', option.image),
                    'info': $('<div class="selected-product-info"></div>'),
                    'title': $('<div class="selected-product-title"></div>').html(option.name),
                    'cf': $('<div class="cf"></div>')
                };

                selectedOptionInfo.info.append(selectedOptionInfo.title);
                selectedProductInfo.div.append(selectedOptionInfo.image);
                selectedProductInfo.div.append(selectedOptionInfo.info);
                selectedProductInfo.div.append(selectedOptionInfo.cf);
            }

            if (selectedProduct.type == 1) {
                landing.div.html('').append(landing.title).append(selectedProductInfo.div);
            } else if (selectedProduct.type == 2) {
                primary.div.html('').append(primary.title).append(selectedProductInfo.div);
            } else if (selectedProduct.type == 3) {
                secondary.div.html('').append(secondary.title).append(selectedProductInfo.div);
            }
        }

        // Append the application optionss
        obj.select.append(landing.div);
        obj.select.append(primary.div);
        obj.select.append(secondary.div);

        obj.select.append($('<div class="cf"></div>'));

        var infoForm = {
            'form': $('<form class="form-info" method="POST" action="api/save"></form>'),
            'title1': $('<div class="form-title-1"></div>').html('Customer'),
            'title2': $('<div class="form-title-2"></div>').html('Information'),
            'input1': $('<input class="form-input">').attr('name', 'name').attr('placeholder', 'Name*'),
            'input2': $('<input class="form-input">').attr('name', 'company').attr('placeholder', 'Company'),
            'input3': $('<input class="form-input">').attr('name', 'email').attr('placeholder', 'Email*'),
            'input4': $('<input class="form-input">').attr('name', 'phone').attr('placeholder', 'Phone'),
            'input5': $('<input class="form-input">').attr('name', 'address1').attr('placeholder', 'Address 1'),
            'input6': $('<input class="form-input">').attr('name', 'address2').attr('placeholder', 'Address 2'),
            'input7': $('<input class="form-input">').attr('name', 'city').attr('placeholder', 'City'),
            'input8': $('<input class="form-input">').attr('name', 'state').attr('placeholder', 'State / Province'),
            'input9': $('<input class="form-input">').attr('name', 'zip').attr('placeholder', 'Zip / Postal Code'),
            'input10': $('<input class="form-input">').attr('name', 'country').attr('placeholder', 'Country'),
            'saveData': $('<input type="hidden" name="save_data" />"'),
            'text1': $('<textarea class="form-text"></textarea>').attr('name', 'notes').attr('placeholder', 'Notes'),
            'buttons': $('<div class="form-buttons"></div>'),
            'saveButton': $('<img class="form-button" />').attr('src', '/img/button_save.png').attr('id', 'btn-save'),
            'saveAndEmailButton': $('<img class="form-button" />').attr('src', '/img/button_saveandemail.png').attr('id', 'btn-save-and-email')
        };

        // Compile Save Data
        var saveData = {};
        saveData.application = obj.application.id;
        saveData.products = {};
        for (i in obj.selectedProducts) {
            var saveProduct = {};
            var selectedProduct  = obj.selectedProducts[i];
            saveProduct.id       = selectedProduct.product.product.id;
            saveProduct.options  = {};
            for (j in selectedProduct.options) {
                var selectedOption = selectedProduct.options[j];
                saveProduct.options[j] = selectedOption.id;
            }
            saveData.products[i] = saveProduct;
        }
        console.log(saveData);
        var saveData = JSON.stringify(saveData);
        console.log(saveData);
        console.log(JSON.stringify(saveData));

        infoForm.saveData.attr('value', JSON.stringify(saveData));

        infoForm.form.append(infoForm.title1).append(infoForm.title2);
        infoForm.form.append(infoForm.input1).append(infoForm.input2);
        infoForm.form.append($('<div class="cf"></div>'));
        infoForm.form.append(infoForm.input3).append(infoForm.input4);
        infoForm.form.append($('<div class="cf"></div>'));
        infoForm.form.append(infoForm.input5).append(infoForm.input6);
        infoForm.form.append($('<div class="cf"></div>'));
        infoForm.form.append(infoForm.input7).append(infoForm.input8);
        infoForm.form.append($('<div class="cf"></div>'));
        infoForm.form.append(infoForm.input9).append(infoForm.input10);
        infoForm.form.append($('<div class="cf"></div>'));
        infoForm.form.append(infoForm.text1);
        infoForm.form.append(infoForm.saveData);
        infoForm.buttons.append(infoForm.saveButton).append(infoForm.saveAndEmailButton);
        infoForm.form.append(infoForm.buttons);

        obj.select.append(infoForm.form);
    },
    showApplication: function(application) {
        var obj = this;
        obj.lastPage = 'application';
        obj.prefix.html('Application');
        obj.title.html(application.name);


        // Make sure the right buttons are showing.
        $('#btn-noneskip, #btn-close, #btn-addoption').hide();
        $('#btn-review, #btn-startover').show();

        // Clear the Item Select div
        obj.select.html('');

        var mainImageDiv = $('<div class="main-image-div"></div>');
        var main = $('<img>');
        main.attr('src', application.main_image).attr('class', 'main-application');
        mainImageDiv.append(main);
        obj.select.append(mainImageDiv);

        var optionsSelected = $('<img class="options-selected" />').attr('src', '/img/button_optionsselected.png');

        var landing     = {
            'div': $('<div class="landing" data-type-id="1"></div>'),
            'a': $('<a class="option-link"></a>'),
            'btn':  $('<img class="option-btn" src="/img/button_view.png">'),
            'title': $('<div class="option-title">Landing Gear</div>')
        };
        landing.a.append(landing.btn);
        landing.div.append(landing.title).append(landing.a);

        var primary     = {
            'div': $('<div class="primary" data-type-id="2"></div>'),
            'a': $('<a class="option-link"></a>'),
            'btn':  $('<img class="option-btn" src="/img/button_view.png">'),
            'title': $('<div class="option-title">Primary Suspension</div>')
        };
        primary.a.append(primary.btn);
        primary.div.append(primary.title).append(primary.a);

        var secondary     = {
            'div': $('<div class="secondary" data-type-id="3"></div>'),
            'a': $('<a class="option-link"></a>'),
            'btn':  $('<img class="option-btn" src="/img/button_view.png">'),
            'title': $('<div class="option-title">Secondary Suspension</div>')
        };
        secondary.a.append(secondary.btn);
        secondary.div.append(secondary.title).append(secondary.a);

        // Show selected Products
        for (i in obj.selectedProducts) {
            var selectedProduct = obj.selectedProducts[i];
            var productInfo = selectedProduct.product.product;
            var productText = '';
            if (productInfo.preview_description.length) { productText += productInfo.preview_description + '<br />'; }
            if (productInfo.preview_capacity_info_1.length) { productText += productInfo.preview_capacity_info_1 + '<br />'; }
            if (productInfo.preview_capacity_info_2.length) { productText += productInfo.preview_capacity_info_2 + '<br />'; }

            selectedProductInfo = {
                'div': $('<div class="selected-product"></div>').attr('data-type-id', selectedProduct.type).attr('data-product-id', productInfo.id),
                'image': $('<img class="selected-product-image" />').attr('src', productInfo.image),
                'info': $('<div class="selected-product-info"></div>'),
                'title': $('<div class="selected-product-title"></div>').html(productInfo.name),
                'text': $('<div class="selected-product-text"></div>').html(productText),
                'buttons': $('<div class="selected-product-buttons"></div>'),
                'change': $('<img class="selected-product-change" />').attr('src', '/img/button_change.png'),
                'options': $('<img class="selected-product-options" />').attr('src', '/img/button_infoandoptions.png')
            }
            selectedProductInfo.info.append(selectedProductInfo.title);
            selectedProductInfo.info.append(selectedProductInfo.text);
            if (selectedProduct.options.length > 0) {
                selectedProductInfo.info.append(optionsSelected);
            }
            selectedProductInfo.buttons.append(selectedProductInfo.change);
            selectedProductInfo.buttons.append(selectedProductInfo.options);
            selectedProductInfo.div.append(selectedProductInfo.image);
            selectedProductInfo.div.append(selectedProductInfo.info);
            selectedProductInfo.div.append(selectedProductInfo.buttons);

            if (selectedProduct.type == 1) {
                landing.div.html('').append(landing.title).append(selectedProductInfo.div);
            } else if (selectedProduct.type == 2) {
                primary.div.html('').append(primary.title).append(selectedProductInfo.div);
            } else if (selectedProduct.type == 3) {
                secondary.div.html('').append(secondary.title).append(selectedProductInfo.div);
            }
        }

        // Append the application optionss
        obj.select.append(landing.div);
        obj.select.append(primary.div);
        obj.select.append(secondary.div);

        obj.addOverlays();

    },
    removeProduct: function(typeId) {
        var obj = this;

        // Remove any current products with this type ID
        for (i in obj.selectedProducts) {
            var selectedProduct = obj.selectedProducts[i];
            if (selectedProduct.type == typeId) {
                obj.selectedProducts.splice(i, 1);
                obj.selectedProductIds.splice(obj.selectedProductIds.indexOf(selectedProduct.product.id), 1);
            }
        }
    },
    chooseProduct: function(productId, typeId) {
        var obj = this;

        obj.removeProduct(typeId);

        // Retrieve the new selections information
        $.get('/api/product/' + productId, function(productData) {
            obj.selectedProducts[productId] = {'type': typeId, 'product': productData, 'options': []};
            obj.selectedProductIds.push(productId);
            obj.showApplication(obj.application);
        });
    },
    chooseOption: function(productId, optionId) {
        var obj = this;
        $.get('/api/option/' + optionId, function(optionData) {
            obj.selectedProducts[productId].options[optionId] = optionData;
            obj.showApplication(obj.application);
        });

    },
    initProducts: function(products) {
        var obj = this;

        obj.lastPage = 'application';

        obj.prefix.html('Choose');
        obj.title.html(products.type.name);
        obj.select.html('').attr('data-item', 'product').attr('data-type-id', products.type.id);

        for (i in products.products) {
            var product = products.products[i];

            var productText = '';
            if (product.preview_description.length) { productText += product.preview_description + '<br />'; }
            if (product.preview_capacity_info_1.length) { productText += product.preview_capacity_info_1 + '<br />'; }
            if (product.preview_capacity_info_2.length) { productText += product.preview_capacity_info_2 + '<br />'; }

            var productHtml = {
                'div': $('<div class="product"></div>').attr('data-product-id', product.id).attr('data-type-id', products.type.id),
                'title': $('<div class="product-title"></div>').html(product.name),
                'info': $('<div class="product-info"></div>'),
                'image': $('<img class="product-image" />').attr('src', product.image),
                'text': $('<div class="product-text"></div>').html(productText),
                'buttons': $('<div class="product-buttons"></div>'),
                'select': $('<img class="product-select" />').attr('src', '/img/button_select.png'),
                'options': $('<img class="product-options" />').attr('src', '/img/button_infoandoptions.png')
            }
            productHtml.info.append(productHtml.title);
            productHtml.info.append(productHtml.text);
            productHtml.buttons.append(productHtml.select);
            productHtml.buttons.append(productHtml.options);
            productHtml.div.append(productHtml.image);
            productHtml.div.append(productHtml.info);
            productHtml.div.append(productHtml.buttons);

            obj.select.append(productHtml.div);
        }

    },
    initRanges: function(ranges) {
        var obj = this;
        obj.select.html('').attr('data-item', 'range');
        $('#btn-review, #btn-startover, #btn-noneskip, #btn-close').hide();
        for (i in ranges) {
            var range   = ranges[i];
            var img     = $('<img>');
            var a       = $('<a></a>');
            img.attr('src', range.image);
            a.append(img).attr('class', 'range').attr('data-id', range.id).attr('data-name', range.name);
            obj.select.append(a);
        }
    },
    initApplications: function(applications) {
        var obj = this;
        obj.select.html('').attr('data-item', 'application');
        $('#btn-review, #btn-noneskip, #btn-close').hide();
        $('#btn-startover').show();
        for (i in applications) {
            var application   = applications[i];
            var img     = $('<img>');
            var a       = $('<a></a>');
            img.attr('src', application.button_image);
            a.append(img).attr('class', 'application').attr('data-id', application.id).attr('data-name', application.name);
            obj.select.append(a);
        }
    }
};

$(window).ready(function() {
    saf.init();
});