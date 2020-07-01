var count = 0;
var stopDownloading = false;

Number.prototype.myPadding = function () {
  var number = this.valueOf();
  var length = 2;
  var str = '' + number;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
};

function getVideoSrc() {
  var link = $('video.vjs-tech');
  if (!link.length) {
    //try fix get src error(domId changed) 
    link = $('video');
  }
  return link.attr('src');
}

function pauseVideo() {
  if ($('button.ssplayer-pause-button.playback__button').length === 1) {
    $('button.ssplayer-pause-button.playback__button').click();
  }
}

function getCourseName() {
  var courseName = $('.course-banner__meta-title a').text() || 'No Course Name';
  courseName = courseName.replace(/[\/:?><]/g, '');
  return courseName;
}

function getSectionDom() {
  var folderDom = $('a[data-control-name="course_video_route"].active')
  .parents('.course-chapter__items')
  .prev('.course-chapter__header')
  .find('h3 .course-chapter__title-text');
  
  return folderDom;
}

function getSaveFilePath() {
  var link = getVideoSrc();
  var courseName = getCourseName();
  // console.log(courseName);

  var folderDom = getSectionDom();
  var sectionName = folderDom.text().trim();
 // var sectionIndex = (folderDom.parents('section.module.open').eq(0).index() + 1).myPadding();
  var saveFolder = sectionName;//sectionIndex + ' - ' + sectionName;
  saveFolder = saveFolder.replace(/[\/:?><]/g, '');
  // console.log(saveFolder);

  var rawFileName = $('a[data-control-name="course_video_route"].active').find('.toc-item__content')[0].firstChild.data;
  //var fileIndex = ($('li.selected').eq(1).index() + 1).myPadding();
  var saveFileName = rawFileName + '.' + 'mp4';//link.split('?')[0].split('.').pop();
  saveFileName = saveFileName.replace(/[\/:?><]/g, '');
  // console.log(saveFileName);

 // console.log('processing => ' + courseName + ' ' + sectionIndex + ' - ' + fileIndex);
  return 'LinkedIn/' + courseName + '/' + saveFolder + '/' + saveFileName;
}

function downloadCurrentVideo() {
  var link = getVideoSrc();
  console.log('downloadCurrentVideo: ' + link);

  var saveFilePath = getSaveFilePath();
  console.log('chrome download => ' + saveFilePath);
  chrome.runtime.sendMessage({
    action: 'download',
    link: link,
    filename: saveFilePath
  },
    function (response) {
      console.log('=> ' + response.actionStatus);
    }
  );
}

function downloadAllVideos() {
  if( $('.quiz-body__quit').length>0){
    $('.quiz-body__quit').click();
 }
  if (stopDownloading) {
    return false;
  }
  var link = getVideoSrc();
  var saveFilePath = getSaveFilePath();
  console.log('chrome download => ' + saveFilePath);

  var downloadAllVideosTimeout = 3000;
  var pauseVideoTimeout = 8000;
  var folderDom = getSectionDom();
  var sectionName = folderDom.text();
  var finalFolderName = $('ul.course-toc__list .course-chapter__title-text:last').text();
  var rawFileName = $('a[data-control-name="course_video_route"].active').find('.toc-item__content')[0].firstChild.data;
  var finalFileName = $('ul.course-toc__list .toc-item__content:last').text().split('  ')[0].trim();

  chrome.runtime.sendMessage({
    action: 'download',
    link: link,
    filename: saveFilePath
  },
    function (response) {
      console.log('response => ' + response.actionStatus);
      if (sectionName == finalFolderName && rawFileName == finalFileName) {
        alert("Full Course Downloaded!");
      } else {
        ($('.ssplayer-next-button')|| $('.quiz-body__quit')).click();
        setTimeout(pauseVideo, pauseVideoTimeout);
        setTimeout(downloadAllVideos, downloadAllVideosTimeout);
      }
    }
  );
}

$(function () {
  $(document).keypress(function (e) {
    if (e.which === 115 || e.which === 83) {
      // keypress `s`
      console.log('s => current');
      downloadCurrentVideo();
    } else if (e.which === 97 || e.which === 65) {
      // keypress `a`
      count = 0;
      console.log('a => all');
      downloadAllVideos();
    }
    else if (e.which == 112 || e.which === 80) {
      // keypress `e`
      stopDownloading = !stopDownloading;
      console.log('e => stop/start download!');
      downloadAllVideos();
    }
  });
});
