/*<input accept="image/jpeg,image/png" id="imgFile" class="span8" type="file" style="display:none" />*/
/**
 * 选择图片并将图片添加到页面
 * @param  {[DOM]} pic [图片容器]
 * @param  {[FileList]} fs  [文件集合]
 */
function handleFiles (pic,fs) {
  window.URL = window.URL || window.webkitURL;
  var img = document.createElement("img");
  img.src = window.URL.createObjectURL(fs[0]);
  img.onload = function() {
    window.URL.revokeObjectURL(this.src);
  }
  pic.appendChild(img);
}

/**
 * 使用ajax发送图片文件到服务器
 * @param  {[File]} file [要发送的文件]
 */
function sendFile(file) {
    console.log(file.size / 1024);
    // jajax.
    GL.isUP = true;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();

    xhr.open("POST", GL.picUpUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {

            var data = JSON.parse(xhr.responseText);
            $(GL.pic).data('url', data.url);
            GL.isUP = false;
            if (GL.verify) collectData();
        }
    };
    fd.append('myFile', file);
    xhr.send(fd);
}

// 选择图片之后，将图片添加到图片容器中
GL.imgFile.on('change', function(e) {
    if (e.target.files.length != 0) {
        GL.pic.innerHTML = '';
        handleFiles(GL.pic, e.target.files);
        sendFile(e.target.files[0]);
    }
});

$('.pic').on('click', function(e) {
    if (GL.isUP) return;
    GL.pic = e.currentTarget;
    GL.imgFile.click();
});

//拖拽上传图片
$('.pic').on('drop',function(e){
  e.preventDefault();
  e.stopPropagation();
  var target = e.originalEvent;
  var dt = target.dataTransfer;
  var files = dt.files;
  handleFiles(e.currentTarget,files);
  GL.pic = e.currentTarget;
  sendFile(files[0]);
});

$('.pic').on('dragenter',function(e){
    e.preventDefault();
    e.stopPropagation();
});
$('.pic').on('dragover',function(e){
    e.preventDefault();
    e.stopPropagation();
});