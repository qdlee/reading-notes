(function() {

    //添加trim方法
    if (!String.prototype.trim) {
      String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
      };
    }

    var validateFun,        //验证方法集合
        pass = true,        //是否通过验证
        showTip;            //显示提示函数

    validateFun = {

        require: function(value, param) {
            return !(value==='');
        },
        max_length: function(value, param) {
            return !(value.length>param.len);
        },
        number: function(value, param) {
            return !isNaN(value);
        },
        min: function(value, param) {
            return !(parseFloat(value) < parseFloat(param.num));
        },
        max: function(value, param) {
            return !(parseFloat(value) > parseFloat(param.num));
        }, 
        email: function(value, param) {
            var pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
            return pattern.test(value);
        },
        url: function(value, param) {
            var pattern = /[a-zA-z]+:\/\/[^\s]+/;
            return pattern.test(value);
        },
        cell_phone: function(value,param){
            var pattern = /^0?1[34578][0-9]{9}$/;
            return pattern.test(value);
        };
    };

    //验证图片
    function validatePic(module) {
        pass = true;
        for(var i in module){
           var obj = document.getElementById(module[i].field); 
           for(var rule in module[i].rules){
                pass = validateFun[rule](obj.data('url').trim(), module[i].rules[rule]);
                if(!pass){
                    showTip(obj);
                    return pass;
                }
           }
        }
        return pass;
    }


    /**
     * 验证
     * @param  {[object]} module []
     * module = [
     *  {
     *    field:this.id,
     *    rules:{
     *      'require':{}
     *    }
     *  }
     *]
     */
    function validate(module) {
        pass = true;
        for(var i in module){
           var obj = document.getElementById(module[i].field); 
           for(var rule in module[i].rules){
                pass = validateFun[rule](obj.value.trim(), module[i].rules[rule]);
                if(!pass){
                    showTip(obj);
                    return pass;
                }
           }
        }
        return pass;
    }

    //注册显示提示函数
    function regShowTip (method) {
        showTip = method;
    }

    window.validate = {
        validatePic: validatePic,
        validate:validate,
        regShowTip:regShowTip
    }
})();
