var validator = (function() {

    var validateFun = {},
        pass = true,
        infoContainer = null;

    validateFun.require = function(input, param) {
        if (input.type == 'radio') {
            if ($('input[name=' + input.name + ']:checked').length <= 0) {
                showTip(input, param.tip);
                pass = false;
            }
        } else {
            if ($.trim(input.value) === "") {
                showTip(input, param.tip);
                pass = false;
            }
        }
    }

    validateFun.max_length = function(input, param) {
        if (input.value.length > param.len) {
            showTip(input, param.tip);
            pass = false;
        }
    };
    validateFun.number = function(input, param) {
        if (isNaN(input.value)) {
            showTip(input, param.tip);
            pass = false;
        }
    };
    validateFun.min = function(input, param) {
        if (parseFloat(input.value) < parseFloat(param.num)) {
            showTip(input, param.tip);
            pass = false;
        }
    };
    validateFun.max = function(input, param) {
        if (parseFloat(input.value) > parseFloat(param.num)) {
            showTip(input, param.tip);
            pass = false;
        }
    };

    validateFun.email = function(input, param) {
        // showTip(input,param.tip);
    }

    validateFun.url = function(obj, param, value) {
        value = typeof value === 'undefined' ? obj.value : value;
        if (value.search(/[a-zA-z]+:\/\/[^\s]+/) == -1) {
            showTip(obj, param.tip);
            pass = false;
        }
    };

    function validatePic(module) {
        pass = true;
        $.each(module, function(i, field) {
            var obj = $('#' + field.field);
            $.each(field.rules, function(rule, param) {
                validateFun[rule](obj[0], param, obj.data('url'));
                if (pass) {
                    obj.css('border', 'none');
                }
            });
        });
        return pass;
    }

    function validate(module) {
        pass = true;
        $.each(module, function(i, field) {
            var obj = $('input[name="' + field.field + '"]');
            $.each(field.rules, function(rule, param) {
                validateFun[rule](obj[0], param);
                if (pass) {
                    obj.css('border', 'solid 1px #ccc');
                }
            });
        });
        return pass;
    }

    function showTip(obj, tip) {
        obj.style.border = "solid 1px red";
        $(infoContainer).append('<span>' + tip + '</span><br>');
        infoContainer[0].scrollIntoView();
    }

    function setInfoContainer(ic) {
        $(ic).children('p:first').remove();
        var p = $('<p style="color:red;"></p>');
        $(ic).prepend(p);
        infoContainer = p;
    }


    return {
        validate: validate,
        validatePic: validatePic,
        setInfoContainer: setInfoContainer
    }
})();
